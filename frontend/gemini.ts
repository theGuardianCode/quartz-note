import { Chat, GoogleGenAI } from "@google/genai";
import { User } from "@supabase/supabase-js";

const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_KEY});

export async function createChat() {
    const chat = await ai.chats.create({
        model: "gemini-2.0-flash",
    });
    return chat;
}

export async function send(message: string, user: User, chat: Chat | undefined) {
    const response = await chat?.sendMessage({
        message: message
    })
    return response?.text;
}