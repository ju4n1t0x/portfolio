import logging
import os
from datetime import datetime
from zoneinfo import ZoneInfo
import resend
from ..models import UserEmail

CONTACT_TIMEZONE = ZoneInfo("America/Argentina/Buenos_Aires")
SITE_NAME = "Portfolio"
SITE_URL = "https://juansasia.com"



class SendEmail:
    def __init__(self) -> None:
        api_key = os.getenv("RESEND_API_KEY")
        if not api_key:
            raise ValueError("RESEND_API_KEY no configurada")
        resend.api_key = api_key

    def sending_email(self, data: UserEmail):
        template_id = os.getenv("RESEND_TEMPLATE_ID")
        if not template_id:
            raise ValueError("RESEND_TEMPLATE_ID no configurada")
        now = datetime.now(CONTACT_TIMEZONE)
        params: resend.Emails.SendParams = {
            "from": os.getenv("FROM_EMAIL", "Acme <onboarding@resend.dev>"),
            "to": [os.getenv("CONTACT_EMAIL", "contacto@juansasia.com")],
            "reply_to": data.email,
            "subject": f"Portfolio: {data.name}",
            "template": {
                "id": template_id,
                "variables": {
                    "DAY": now.strftime("%d/%m/%Y"),
                    "HOUR": now.strftime("%H:%M"),
                    "NAME_USER": data.name,
                    "SENDER_EMAIL": data.email,
                    "MESSAGE": data.consulta,
                    "SITE_NAME": SITE_NAME,
                    "SITE_URL": SITE_URL,
                },
            },
        }

        email = resend.Emails.send(params)

        return email
