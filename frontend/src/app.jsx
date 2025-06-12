import { useEffect, useState } from 'preact/hooks';
import { Editor } from './components/editor';
import { PageList } from './components/page_list';
import { supabase } from '../connection';
import { Modal } from './components/modal';
import { v4 as uuidv4 } from 'uuid';
import './app.css'

export function App(props) {
    const [pages, setPages] = useState([]);
    const [blocks, setBlocks] = useState();
    const [activePage, setActivePage] = useState({});
    const [showModal, setShowModal] = useState(false);

    useEffect(async () => {
        // sign in with password
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: import.meta.env.VITE_TEST_EMAIL,
            password: import.meta.env.VITE_TEST_PASS
        })
        if (authError != null) {
            console.log(authError);
        }

        authData.user.id

        loadPages();

        // Supabase listener to update page list when db changes
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
                    if (payload.new?.userId == authData.user.id || payload.old?.userId == authData.user.id) {
                        loadPages();
                    }
                }
            )
            .subscribe();

    }, [])

    async function changePage(pageId, pageName) {
        // Retrieve blocks from supabase
        const { data, error } = await supabase.from('blocks').select().order('created_at', {ascending: true}).eq("pageId", pageId);
        let schema = {
            time: new Date().getTime(),
            blocks: [],
            version: "2.31.0-rc.7"
        }

        // Format in editor.js format
        data.forEach(block => {
            schema.blocks.push({id: block.id, type: block.type, data: block.data});
        })

        setActivePage({id: pageId, name: pageName});
        setBlocks(schema);
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

    async function createNote(filename) {
        const { data, error } = await supabase.auth.getUser();
        const schema = {id: uuidv4(), name: filename, userId: data.user.id};
        const { data: record, error: err } = await supabase.from('pages').insert(schema).select();
        console.log(record);
        if (err) {
            throw err;
        }
    }

    return (
        <div class="container">
            {showModal ? <Modal message="New note:" buttonText="create" buttonCallback={createNote} toggleModal={setShowModal}/> : null}
            <PageList pages={pages} changePage={changePage} setShowModal={setShowModal}/>
            {Object.keys(activePage).length > 0 ? <Editor data={blocks} pageId={activePage.id} pageName={activePage.name}/> : null}
        </div>
    )
}
