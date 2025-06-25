import { useState } from "react";
import { supabase } from "../../connection";
import './modal.css';

type ModalProps = {
    buttonCallback: Function,
    toggleModal: Function
};

export function AccountModal({buttonCallback, toggleModal}: ModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [signUp, setSignUp] = useState(false);
    const [errorText, setErrorText] = useState("");

    function handleLogIn() {
        buttonCallback(email, password);
        toggleModal(false);
    }

    async function handleSignUp() {
        if (password == confirmPassword) {
            const {data, error} = await supabase.auth.signUp({
                email: email,
                password: password
            });

            if (error) {
                setErrorText(error.message);
            } else {
                toggleModal(false);
            }
        } else {
            setErrorText("Passwords do not match");
        }
    }

    return (
        <div className="modal-container">
            <div className="modal-content">
                <span className="modal-header"><h2>Account</h2><span className="close-btn" onClick={() => toggleModal(false)}>&#x2715;</span></span>
                {errorText ? <div className="error-box">{errorText}</div> : null}
                <div className="action-select"><div onClick={() => setSignUp(false)} className="option">Log In</div><div onClick={() => setSignUp(true)} className="option">Sign Up</div></div>
                <hr />
                {signUp ?
                    <>
                        <input value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} type="email" placeholder="email@domain.com"></input>
                        <input value={password} onInput={(e) => setPassword((e.target as HTMLInputElement).value)} type="password" placeholder="Password..."></input>
                        <input value={confirmPassword} onInput={(e) => setConfirmPassword((e.target as HTMLInputElement).value)} type="password" placeholder="Confirm password..."></input>
                        <button onClick={handleSignUp}>Sign Up</button>
                    </> :
                    <>
                        <input value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} type="email" placeholder="email@domain.com"></input><br/>
                        <input value={password} onInput={(e) => setPassword((e.target as HTMLInputElement).value)} type="password" placeholder="Password..."></input><br/>
                        <button onClick={handleLogIn}>Log In</button>
                    </>
                }
            </div>
        </div>
    );
}