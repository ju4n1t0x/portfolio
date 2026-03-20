export const contactFlowIntro =
  "¡Hola! Para ponerte en contacto conmigo, voy a necesitar algunos datos. Primero, ¿cuál es tu nombre completo?"

export function contactAskEmail(name: string): string {
  return `Perfecto, ${name}. Ahora necesito tu email.`
}

export const contactAskMessage =
  "Genial. Por último, escribí tu consulta o mensaje."

export const contactSuccessMessage =
  "Tu mensaje fue recibido correctamente. Me voy a poner en contacto a la brevedad. ¡Gracias!"

export const contactSendErrorMessage =
  "Hubo un problema al enviar tu mensaje. Por favor, intentá de nuevo más tarde."
