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
    const [pageType, setPageType] = useState("note");

    function handleClick() {
        buttonCallback(value, pageType);
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
                <select value={pageType} onChange={(e) => {setPageType(e.target.value)}} style={{fontSize: "24px", margin: "10px 0"}}>
                    <option value="note">Note</option>
                    <option value="canvas">Canvas</option>
                </select>
                <input value={value} onInput={(e) => setValue((e.target as HTMLInputElement).value)} placeholder="Page name..."></input>
                <button onClick={handleClick}>{buttonText}</button>
            </div>
        </div>
    );
}