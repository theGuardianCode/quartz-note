import { useEffect, useRef, useState } from "preact/hooks";

import { createChat, send } from "../../gemini";
import { supabase } from "../../connection";

export function Chat() {
    let chat = useRef();
    const [conversation, setConversation] = useState([]);
    const [message, setMessage] = useState("");

    async function sendMessage() {
        const {data: userData, error} = await supabase.auth.getUser();
        if (error) {
            conversation.current.push("Error retrieving user data - you might not be logged in");
            return;
        }

        const text = await send(message, userData.user, chat.current);
        setConversation([...conversation, message, text]);
    }

    useEffect(async () => {
        if (!chat.current) {
            chat.current = await createChat();
        }
    }, [])

    useEffect(() => {
        console.log(conversation);
    }, [conversation]);

    return (
        <div>
            <ul>
                {conversation.map((msg) => (
                    <li>{msg}</li>
                ))}
            </ul>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)}/>
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}