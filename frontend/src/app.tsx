import { useEffect, useState } from 'react';
import { LeftMenu } from './components/left_menu';
import { Modal } from './components/modal';
import { supabase } from './scripts/connection';
import { AccountModal } from './components/account_modal';
import { v4 as uuidv4 } from 'uuid';
import { Session, User, WeakPassword } from '@supabase/supabase-js';
import { Switcher } from './components/switcher';
import { EventsEmit } from '../wailsjs/runtime/runtime';
import { ListPages } from '../wailsjs/go/main/Database'
import './app.css';

type PageSchema = {
    id: string;
    name: string;
    type: string;
    cloud: boolean;
};

type AuthDataSchema = {
    user: User;
    session: Session;
    weakPassword?: WeakPassword;
} | {
    user: null;
    session: null;
    weakPassword?: null;
};

type PageSchemaDb = {
    id: string;
    created_at: number;
    name: string;
    userId: string;
}

function App() {
    const [pages, setPages] = useState<any[]>([]);
    const [activePage, setActivePage] = useState<PageSchema>();
    const [authData, setAuthData] = useState<AuthDataSchema>();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        loadPages();

        // Supabase listener to update page list when db changes
        if (!subscribed) {
            try {
                const channel = supabase
                .channel('realtime:pages')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'pages'
                    },
                    (payload) => {
                        if ((payload.new as PageSchemaDb).userId == authData?.user?.id || (payload.old as PageSchemaDb).userId == authData?.user?.id) {
                            loadPages();
                        }
                    }
                )
                .subscribe();
                setSubscribed(true);
            } catch (error) {}
        }
    }, [])

    async function changePage(pageId: string, pageName: string, pageType: string, cloud: boolean) {
        setActivePage({id: pageId, name: pageName, type: pageType, cloud: cloud})
    }

    async function login(email: string, password: string) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (authError != null) {
            console.log(authError);
        } else {
            setAuthData(authData);
        }

        const { data, error } = await supabase.auth.getUser();
        if (data.user) {
            loadPages();
        }
    }

    async function logout() {
        await supabase.auth.signOut();
        loadPages();
        setActivePage(undefined);
    }

    async function loadPages() {
        // Get users pages 
        const { data: pageData, error } = await supabase.from('pages').select();
        if (error != null) {
            console.log(error);
        } else {
            ListPages().then((localPages) => {
                localPages = localPages.map((page) => ({...page, cloud: false}));
                const cloudPages = pageData.map((page) => ({...page, cloud: true}));
                const pageList = [...cloudPages, ...localPages];
                setPages(pageList);
            });
        }
    }

    async function createNote(filename: string, pageType: string, cloud: boolean) {
        if (cloud) {
            const { data, error } = await supabase.auth.getUser();
            const pageId = uuidv4();
            const schema = {id: pageId, name: filename, userId: data.user?.id, type: pageType};
            const { error: err } = await supabase.from('pages').insert(schema).select();
            if (err) {
                throw err;
            }
        } else {
            EventsEmit("create-page", filename, pageType);
            setTimeout(loadPages, 500);
        }

    }

    return (
        <div className="container">
            {showCreateModal ? <Modal message="New page:" buttonText="create" buttonCallback={createNote} toggleModal={setShowCreateModal}/> : null}
            {showAccountModal ? <AccountModal buttonCallback={login} toggleModal={setShowAccountModal}/> : null}
            <LeftMenu pages={pages} changePage={changePage} showCreateModal={setShowCreateModal} showAccountModal={setShowAccountModal} logout={logout}/>
            {activePage ?
                <Switcher page={activePage} /> :
                <div className="placeholder">
                    <h1>Select a page</h1>
                    <p>New Page - Cmd or Ctrl + n</p>
                </div>
            }
        </div>
    );
}

export default App;