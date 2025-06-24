import { Chat, GoogleGenAI } from "@google/genai";
import { User } from "@supabase/supabase-js";

const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_KEY});

export async function createChat(history: any[] = []) {
    const chat = await ai.chats.create({
        model: "gemini-2.0-flash",
        history: history,
        config: {
            systemInstruction: "You are an AI agent called Galileo, helping students understand their notes and STEM topics"
        }
    });
    return chat;
}

export async function send(message: string, user: User, chat: Chat | undefined) {
    const response = await chat?.sendMessage({
        message: message
    })
    return response?.text;
}