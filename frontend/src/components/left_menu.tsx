import { useEffect, useState } from 'react';
import { supabase } from '../scripts/connection';
import { EventsOn } from '../../wailsjs/runtime/runtime';
import './left_menu.css';
import { User } from '@supabase/supabase-js';

type LeftMenuProps = {
    pages: any[],
    changePage: Function,
    showCreateModal: Function,
    showAccountModal: Function,
    logout: Function
};

export function LeftMenu({pages, changePage, showCreateModal, showAccountModal, logout}: LeftMenuProps) {
    const [accountInfo, setAccountInfo] = useState<User | null>();
    const [showAccountMenu, setShowAccountMenu] = useState(false);

    useEffect(() => {
        EventsOn("new-page", toggleModal);

        const getUser = async () => {
            const { data, error } = await supabase.auth.getUser()
            setAccountInfo(data.user);
        }

        getUser();
    }, []);

    function toggleModal() {
        showCreateModal(true);
    }

    function handleLogout() {
        logout();
        setAccountInfo(null);
    }

    return (
        <div className="left-menu">
            <div className="page-section">
                <span id="page-header">Pages<button onClick={toggleModal}>+</button></span>
                <ul>
                    {pages.map(page => (
                        <li className="page-container" key={page.id}>
                            <span className="page-title" onClick={() => changePage(page.id, page.name, page.type)}>{page.name}</span><button>&#8942;</button>
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
                        <span onClick={handleLogout}>Logout</span>
                    </div> :
                    null}
                    <span id="account-btn" onClick={() => setShowAccountMenu(!showAccountMenu)}>Account {!showAccountMenu ? <i className="arrow up"></i> : <i className="arrow down"></i>}</span>
                </span> : 
                <span id="login-btn" onClick={() => showAccountModal(true)}>Log In</span>}
            </div>
        </div>
    );
}