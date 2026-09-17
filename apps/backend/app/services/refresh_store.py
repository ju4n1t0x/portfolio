import os
import sqlite3
import threading
import time


_SCHEMA = """
CREATE TABLE IF NOT EXISTS refresh_tokens (
    jti TEXT PRIMARY KEY,
    sub TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    revoked INTEGER NOT NULL DEFAULT 0,
    replaced_by TEXT,
    created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_refresh_sub ON refresh_tokens(sub);
"""


def _resolve_db_path() -> str:
    explicit = os.getenv("REFRESH_DB_PATH")
    if explicit:
        return explicit
    for candidate in ("/app/data/refresh.db", "data/refresh.db", "../data/refresh.db"):
        parent = os.path.dirname(candidate)
        if parent and os.path.isdir(parent):
            return candidate
    return "/tmp/refresh.db"


class RefreshStore:
    def __init__(self, db_path: str | None = None):
        self.db_path = db_path or _resolve_db_path()
        directory = os.path.dirname(self.db_path)
        if directory:
            os.makedirs(directory, exist_ok=True)
        self._lock = threading.Lock()
        self._init_schema()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, timeout=10)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_schema(self) -> None:
        with self._lock, self._connect() as conn:
            conn.executescript(_SCHEMA)

    def issue(self, jti: str, sub: str, expires_at: int) -> None:
        now = int(time.time())
        with self._lock, self._connect() as conn:
            conn.execute(
                "INSERT OR REPLACE INTO refresh_tokens (jti, sub, expires_at, revoked, replaced_by, created_at)"
                " VALUES (?, ?, ?, 0, NULL, ?)",
                (jti, sub, expires_at, now),
            )

    def fetch(self, jti: str) -> sqlite3.Row | None:
        with self._lock, self._connect() as conn:
            return conn.execute("SELECT * FROM refresh_tokens WHERE jti = ?", (jti,)).fetchone()

    def is_active(self, jti: str) -> bool:
        row = self.fetch(jti)
        if row is None:
            return False
        if row["revoked"]:
            return False
        return int(row["expires_at"]) > int(time.time())

    def was_revoked(self, jti: str) -> bool:
        row = self.fetch(jti)
        return row is not None and bool(row["revoked"])

    def rotate(self, old_jti: str, new_jti: str, sub: str, new_expires_at: int) -> None:
        now = int(time.time())
        with self._lock, self._connect() as conn:
            conn.execute(
                "UPDATE refresh_tokens SET revoked = 1, replaced_by = ? WHERE jti = ?",
                (new_jti, old_jti),
            )
            conn.execute(
                "INSERT OR REPLACE INTO refresh_tokens (jti, sub, expires_at, revoked, replaced_by, created_at)"
                " VALUES (?, ?, ?, 0, NULL, ?)",
                (new_jti, sub, new_expires_at, now),
            )

    def revoke_family(self, sub: str) -> None:
        with self._lock, self._connect() as conn:
            conn.execute("UPDATE refresh_tokens SET revoked = 1 WHERE sub = ? AND revoked = 0", (sub,))

    def revoke(self, jti: str) -> None:
        with self._lock, self._connect() as conn:
            conn.execute("UPDATE refresh_tokens SET revoked = 1 WHERE jti = ?", (jti,))

    def purge_expired(self) -> None:
        now = int(time.time())
        with self._lock, self._connect() as conn:
            conn.execute("DELETE FROM refresh_tokens WHERE expires_at < ?", (now,))
