import { useEffect, useRef, useState } from "react";

import { createChat, send } from "../scripts/gemini";
import { supabase } from "../scripts/connection";
import { Chat } from "@google/genai";
import { OutputBlockData } from "@editorjs/editorjs";
import { marked } from "marked";

import "./chat.css";

type ChatProps = {
    pageContents: OutputBlockData[];
    pageId: string | undefined;
    hideChat: Function;
};

export function ChatPane({pageContents, pageId, hideChat}: ChatProps) {
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

            // Add context for the page
            if (/@Page/.test(message)) {
                prompt += "\n@Page represents a page with the following content. Don't talk about the structure of the JSON. JSON: " + JSON.stringify(pageContents, null, 4);
            }

            // Add user's input to chat list
            messageListRef.current.push({id: idCounter.current, role: 'user', text: message});
            idCounter.current += 1;
            setConversation(messageListRef.current);
            setMessage("");

            // Wait for the AI response then add to chat list
            const text = await send(prompt, userData.user, chat.current);
            messageListRef.current.push({id: idCounter.current, role: 'model', text: text});
            idCounter.current += 1;
            setConversation(messageListRef.current);

            // Update db with chat messages
            saveMessages(messageListRef.current);
        }
    }

    async function saveMessages(messages: any[]) {
        const formattedMessages = messages.map(message => ({role: message.role, parts: [{text: message.text}]}))
        console.log(formattedMessages);
        const { data, error } = await supabase.from('pages').update({chatMessages: formattedMessages}).eq('id', pageId);
        if (error) {
            console.log("error updated messages");
            console.log(error);
        }
    }   

    useEffect(() => {
        const constructChat = async () => {
            // Retrieve chat history
            const loadChatHistory = async () => {
                const { data, error } = await supabase.from('pages').select('chatMessages').eq('id', pageId);
                if (data) {
                    const history = data[0].chatMessages;
                    chat.current = await createChat(history);
                    const formattedMessages = history.map((message: any) => {
                        const record = {id: idCounter.current, role: message.role, text: message.parts[0].text};
                        idCounter.current += 1;
                        return record;
                    });
                    messageListRef.current = formattedMessages;
                    setConversation(messageListRef.current);
                }
            }
            loadChatHistory();
        };

        constructChat();
    }, [pageId]);

    return (
        <div className="ai-chat">
            <div className="close-chat-btn" onClick={() => hideChat()}>
                X
            </div>
            <ul>
                {conversation.map((msg) => {
                    return <li key={msg.id} className={`msg-box ${msg.role}`} dangerouslySetInnerHTML={{__html: marked.parse(msg.text)}}></li>
                })}
            </ul>
            <div className="input">
                <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}