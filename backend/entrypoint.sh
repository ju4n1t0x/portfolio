#!/usr/bin/env bash
set -e
if [ ! -f "$EMBEDDINGS_PATH" ]; then
  echo "Embeddings no encontrados, generando..."
  python -m app.scripts.build_embeddings
fi
exec uvicorn app.main:app --host 0.0.0.0 --port 8000