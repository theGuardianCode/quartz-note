import { useState } from "react";
import './modal.css';

type ModalProps = {
    message: string,
    buttonText: string,
    buttonCallback: Function,
    toggleModal: Function
};

export function AccountModal({message, buttonText, buttonCallback, toggleModal}: ModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleClick() {
        buttonCallback(email, password);
        toggleModal(false);
    }

    return (
        <div className="modal-container">
            <div className="modal-content">
                <span className="modal-header"><h2>{message}</h2><span className="close-btn" onClick={() => toggleModal(false)}>&#x2715;</span></span>
                <input value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)}></input><br/>
                <input value={password} onInput={(e) => setPassword((e.target as HTMLInputElement).value)} type="password"></input><br/>
                <button onClick={handleClick}>{buttonText}</button>
            </div>
        </div>
    );
}