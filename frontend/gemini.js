import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_KEY});

export async function createChat() {
    const chat = await ai.chats.create({
        model: "gemini-2.0-flash",
    });
    return chat;
}

export async function send(message, user, chat) {
    const response = await chat.sendMessage({
        message: message
    })
    return response.text;
}