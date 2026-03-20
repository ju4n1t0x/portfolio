import logging
from fastapi import APIRouter, Depends, HTTPException
logger = logging.getLogger(__name__)
from fastapi.responses import StreamingResponse
from ..controllers import AgentJuaniController, SendEmailController
from ..middleware.auth import get_current_user, TokenPayload
from ..models.answer import Answer
from ..models.user_email import UserEmail
api_route = APIRouter()


def get_agent_controller():
    return AgentJuaniController()

def get_email_controller():
    return SendEmailController()

@api_route.post("/agentJuani")
def agent_juani(
    data: Answer,
    controller: AgentJuaniController = Depends(get_agent_controller),
    current_user: TokenPayload = Depends(get_current_user),
):
    return StreamingResponse(
        controller.post_agent_juani(data),
        media_type="text/event-stream"
    )

@api_route.post("/sendEmail", status_code=201)
def sending_email(
    data: UserEmail,
    controller: SendEmailController = Depends(get_email_controller),
    current_user: TokenPayload = Depends(get_current_user),
):
    try:
        response = controller.post_send_email(data)
        return {"success": True, "message": "Email enviado con exito"}
    except HTTPException:
        raise
    except ValueError as e:
        logger.exception("Error de configuracion en /sendEmail: %s", str(e))
        raise HTTPException(status_code=500, detail="Error de configuracion del servicio")
    except Exception as e:
        logger.exception("Error inesperado en /sendEmail: %s", str(e))
        raise HTTPException(status_code=500, detail="Error al enviar el email")
