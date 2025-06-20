import { useState } from "react";
import './modal.css';

type ModalProps = {
    message: string,
    buttonText: string,
    buttonCallback: Function,
    toggleModal: Function
};

export function Modal({message, buttonText, buttonCallback, toggleModal}: ModalProps) {
    const [value, setValue] = useState("");

    function handleClick() {
        buttonCallback(value);
        toggleModal(false);
    }

    function handlekeyDown(event: React.KeyboardEvent) {
        if (event.key == 'Escape') {
            event.preventDefault();
            toggleModal(false);
        }
    }

    return (
        <div className="modal-container" onKeyDown={handlekeyDown}>
            <div className="modal-content">
                <span className="modal-header"><h2>{message}</h2><span className="close-btn" onClick={() => toggleModal(false)}>&#x2715;</span></span>
                <input value={value} onInput={(e) => setValue((e.target as HTMLInputElement).value)} placeholder="Page name..."></input><br/>
                <button onClick={handleClick}>{buttonText}</button>
            </div>
        </div>
    );
}