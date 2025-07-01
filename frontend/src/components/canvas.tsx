import { useEffect } from "react";
import { getSnapshot, loadSnapshot, Tldraw, useEditor } from "tldraw";
import { EventsOn } from "../../wailsjs/runtime/runtime";
import { supabase } from "../scripts/connection";
import 'tldraw/tldraw.css';

type PageSchema = {
    id: string;
    name: string;
    type: string;
};

type PropType = {
    page: PageSchema;
};

export function Canvas({page}: PropType) {
    return (
        <div style={{marginLeft: "auto", flexGrow: 1, overflowY: "auto"}}>
            <Tldraw>
                <LogicComponent page={page}/>
            </Tldraw>
        </div>
    );
}

function LogicComponent({page}: PropType) {
    const editor = useEditor();

    useEffect(() => {
        // Initialise canvases record
        async function initialiseCanvas() {
            const {data, error} = await supabase.from('canvases').select().eq('pageId', page.id);
            if (error) {
                console.log(error);
                throw error;
            }

            // If no record exists create one
            if (data.length == 0) {
                const { error } = await supabase.from('canvases').insert({pageId: page.id, document: document});
                if (error) {
                    console.log(error);
                    throw error;
                }
            } else {
                data[0].document
                loadSnapshot(editor.store, {document: data[0].document});
            }
        }
        initialiseCanvas();

        EventsOn("save", async () => {
            const { document, session } = getSnapshot(editor.store);
            
            const {data, error} = await supabase.from('canvases').select().eq('pageId', page.id);
            if (error) {
                console.log(error);
                throw error;
            }

            // If no record exists create one
            if (data.length == 0) {
                const { error } = await supabase.from('canvases').insert({pageId: page.id, document: document});
                if (error) {
                    console.log(error);
                    throw error;
                }
            } else {
                const { error } = await supabase.from('canvases').update({document: document}).eq('pageId', page.id);
                if (error) {
                    console.log(error);
                    throw error;
                }
            }
        })
    }, [])

    return null;
}