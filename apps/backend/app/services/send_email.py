import logging
import os
import resend
from ..models import UserEmail



class SendEmail:
    def __init__(self) -> None:
        api_key = os.getenv("RESEND_API_KEY")
        if not api_key:
            raise ValueError("RESEND_API_KEY no configurada")
        resend.api_key = api_key

    def sending_email(self, data: UserEmail):
        params: resend.Emails.SendParams = {
            "from": os.getenv("FROM_EMAIL", "Acme <onboarding@resend.dev>"),
            "to": [os.getenv("CONTACT_EMAIL", "contacto@juansasia.com")],
            "reply_to": data.email,
            "subject": f"Portfolio: {data.name}",
            "html": data.consulta,
        }

        email = resend.Emails.send(params)
       
        return email
