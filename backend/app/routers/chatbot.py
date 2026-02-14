from fastapi import APIRouter
from ..schemas.chatbot import ChatRequest, ChatResponse
from ..services.chatbot_service import get_chat_response

router = APIRouter(prefix="/api/chatbot", tags=["AI Chatbot"])


@router.post("/message", response_model=ChatResponse)
async def chat_message(data: ChatRequest):
    """Send a message to the AI farming assistant."""
    history = None
    if data.history:
        history = [{"role": msg.role, "content": msg.content} for msg in data.history]

    response = await get_chat_response(message=data.message, history=history, lang=data.lang)
    return ChatResponse(response=response)
