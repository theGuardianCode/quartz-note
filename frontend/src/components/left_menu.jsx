import { useEffect, useState } from 'preact/hooks';
import { supabase } from '../../connection';
import { EventsOn } from '../../wailsjs/runtime/runtime';
import './left_menu.css';

export function LeftMenu({pages, changePage, showCreateModal, showAccountModal, logout}) {
    const [accountInfo, setAccountInfo] = useState();
    const [showAccountMenu, setShowAccountMenu] = useState(false);

    useEffect(() => {
        EventsOn("new-page", toggleModal);
    }, []);

    useEffect(async () => {
        const { data, error } = await supabase.auth.getUser()
        setAccountInfo(data.user);
    })

    function toggleModal() {
        showCreateModal(true);
    }

    return (
        <div class="left-menu">
            <div class="page-section">
                <span id="page-header">Pages<button onClick={toggleModal}>+</button></span>
                <ul>
                    {pages.map(page => (
                        <li class="page-container">
                            <span class="page-title" onClick={() => changePage(page.id, page.name)}>{page.name}</span><button>&#8942;</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="account-section">
                {accountInfo ? 
                <span id="account-menu">
                    { showAccountMenu ? 
                    <div id="menu-content">
                        <p>{accountInfo.email}</p>
                        <span onClick={logout}>Logout</span>
                    </div> :
                    null}
                    <span id="account-btn" onClick={() => setShowAccountMenu(!showAccountMenu)}>Account {!showAccountMenu ? <i class="arrow up"></i> : <i className="arrow down"></i>}</span>
                </span> : 
                <span id="login-btn" onClick={() => showAccountModal(true)}>Log In</span>}
            </div>
        </div>
    );
}