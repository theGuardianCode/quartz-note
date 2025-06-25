import { useEffect, useState } from 'react';
import { Editor } from './components/editor';
import { LeftMenu } from './components/left_menu';
import { Modal } from './components/modal';
import { supabase } from '../connection';
import { AccountModal } from './components/account_modal';
import { v4 as uuidv4 } from 'uuid';
import './app.css';
import { Session, User, WeakPassword } from '@supabase/supabase-js';

type BlockSchema = {
    time: number;
    blocks: any[];
    version: string;
};

type PageSchema = {
    id: string;
    name: string;
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
    userId: string
}

function App() {
    const [pages, setPages] = useState<any[]>([]);
    const [blocks, setBlocks] = useState<BlockSchema>();
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

    async function changePage(pageId: string, pageName: string) {
        // Retrieve blocks from supabase
        const { data, error } = await supabase.from('blocks').select().order('created_at', {ascending: true}).eq("pageId", pageId);
        let schema: BlockSchema = {
            time: new Date().getTime(),
            blocks: [],
            version: "2.31.0-rc.7"
        }

        // Format in editor.js format
        data?.forEach(block => {
            schema.blocks.push({id: block.id, type: block.type, data: block.data});
        })

        setActivePage({id: pageId, name: pageName});
        setBlocks(schema);
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
            setPages(pageData);
        }
    }

    async function createNote(filename: string) {
        const { data, error } = await supabase.auth.getUser();
        const schema = {id: uuidv4(), name: filename, userId: data.user?.id};
        const { data: record, error: err } = await supabase.from('pages').insert(schema).select();
        if (err) {
            throw err;
        }
    }

    return (
        <div className="container">
            {showCreateModal ? <Modal message="New page:" buttonText="create" buttonCallback={createNote} toggleModal={setShowCreateModal}/> : null}
            {showAccountModal ? <AccountModal buttonCallback={login} toggleModal={setShowAccountModal}/> : null}
            <LeftMenu pages={pages} changePage={changePage} showCreateModal={setShowCreateModal} showAccountModal={setShowAccountModal} logout={logout}/>
            {activePage ?
                <Editor initialData={blocks} pageId={activePage?.id} pageName={activePage?.name}/> :
                <div className="placeholder">
                    <h1>Select a page</h1>
                    <p>New Page - Cmd or Ctrl + n</p>
                </div>
            }
        </div>
    );
}

export default App;