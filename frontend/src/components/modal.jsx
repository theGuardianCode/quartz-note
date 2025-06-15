import { useState } from "preact/hooks";
import './modal.css';

export function Modal({message, buttonText, buttonCallback, toggleModal}) {
    const [value, setValue] = useState("");

    function handleClick() {
        buttonCallback(value);
        toggleModal(false);
    }

    function handlekeyDown(event) {
        if (event.key == 'Escape') {
            toggleModal(false);
        }
    }

    return (
        <div class="modal-container" onKeyDown={handlekeyDown}>
            <div className="modal-content">
                <span class="modal-header"><h2>{message}</h2><span class="close-btn" onClick={() => toggleModal(false)}>&#x2715;</span></span>
                <input value={value} onInput={(e) => setValue(e.target.value)} placeholder="Page name..."></input><br/>
                <button onClick={handleClick}>{buttonText}</button>
            </div>
        </div>
    );
}