import { useEffect, useRef, useState } from "react";

import { createChat, send } from "../../gemini";
import { supabase } from "../../connection";
import { Chat } from "@google/genai";
import { OutputBlockData } from "@editorjs/editorjs";

import "./chat.css";

type ChatProps = {
    pageContents: OutputBlockData[];
};

export function ChatPane({pageContents}: ChatProps) {
    let chat = useRef<Chat>();
    const [conversation, setConversation] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const idCounter = useRef<number>(0);
    const messageListRef = useRef<any[]>([]);

    async function sendMessage() {
        if (message !== "") {
            const { data: userData, error } = await supabase.auth.getUser();
            if (error) {
                setConversation([...conversation, "Error retrieving user data - you might not be logged in"]);
                return;
            }
            let prompt = message;
            if (/@Page/.test(message)) {
                prompt += "\n@Page represents a page with the following content. Don't talk about the structure of the JSON. JSON: " + JSON.stringify(pageContents, null, 4);
            }

            console.log(prompt);

            // Add user's input to chat list
            messageListRef.current.push({id: idCounter.current, role: 'user', text: message});
            idCounter.current += 1;
            setConversation(messageListRef.current);
            setMessage("");

            // Wait for the AI response then add to chat list
            const text = await send(prompt, userData.user, chat.current);
            messageListRef.current.push({id: idCounter.current, role: 'agent', text: text});
            idCounter.current += 1;
            setConversation(messageListRef.current);
        }
    }

    useEffect(() => {
        const constructChat = async () => {
            if (!chat.current) {
                chat.current = await createChat();
            }
        }

        constructChat();
    }, []);

    useEffect(() => {
        console.log(conversation);
    }, [conversation])

    return (
        <div className="ai-chat">
            <ul>
                {conversation.map((msg) => (
                    <li key={msg.id} className={`msg-box ${msg.role}`}>{msg.text}</li>
                ))}
            </ul>
            <div className="input">
                <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}