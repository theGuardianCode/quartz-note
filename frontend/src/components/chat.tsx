import { useEffect, useRef, useState } from "react";

import { createChat, send } from "../../gemini";
import { supabase } from "../../connection";

import "./chat.css";
import { Chat } from "@google/genai";

export function ChatPane() {
    let chat = useRef<Chat>();
    const [conversation, setConversation] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const messageListRef = useRef<any[]>([]);

    async function sendMessage() {
        if (message !== "") {
            const { data: userData, error } = await supabase.auth.getUser();
            if (error) {
                setConversation([...conversation, "Error retrieving user data - you might not be logged in"]);
                return;
            }
            messageListRef.current.push({role: 'user', text: message});
            setConversation(messageListRef.current);
            setMessage("");

            const text = await send(message, userData.user, chat.current);
            messageListRef.current.push({role: 'agent', text: text});
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

    return (
        <div className="ai-chat">
            <ul>
                {conversation.map((msg) => (
                    <li className={`msg-box ${msg.role}`}>{msg.text}</li>
                ))}
            </ul>
            <div className="input">
                <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}