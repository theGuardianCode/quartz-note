import { useState } from "preact/hooks";
import './modal.css';

export function Modal({message, buttonText, buttonCallback, toggleModal}) {
    const [value, setValue] = useState("");

    function handleClick() {
        buttonCallback(value);
        toggleModal(false);
    }

    return (
        <div class="modal-container">
            <div className="modal-content">
                <h2>{message}</h2><span class="close-btn" onClick={() => toggleModal(false)}>x</span>
                <input value={value} onInput={(e) => setValue(e.target.value)}></input><br/>
                <button onClick={handleClick}>{buttonText}</button>
            </div>
        </div>
    );
}