import { useState } from "preact/hooks";
import './modal.css';

export function AccountModal({message, buttonText, buttonCallback, toggleModal}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleClick() {
        buttonCallback(email, password);
        toggleModal(false);
    }

    return (
        <div class="modal-container">
            <div className="modal-content">
                <span class="modal-header"><h2>{message}</h2><span class="close-btn" onClick={() => toggleModal(false)}>&#x2715;</span></span>
                <input value={email} onInput={(e) => setEmail(e.target.value)}></input><br/>
                <input value={password} onInput={(e) => setPassword(e.target.value)} type="password"></input><br/>
                <button onClick={handleClick}>{buttonText}</button>
            </div>
        </div>
    );
}