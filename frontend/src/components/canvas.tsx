import { useEffect } from "react";
import { getSnapshot, loadSnapshot, Tldraw, useEditor } from "tldraw";
import { EventsOff, EventsOn } from "../../wailsjs/runtime/runtime";
import { supabase } from "../scripts/connection";
import 'tldraw/tldraw.css';
import { InitialiseCanvas, SaveCanvas } from "../../wailsjs/go/main/Database";

type PageSchema = {
    id: string;
    name: string;
    type: string;
    cloud: boolean;
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
        
    }, []);

    useEffect(() => {
        if (page.cloud) {
            // Initialise canvases record
            async function initialiseCanvas() {
                const {data, error} = await supabase.from('canvases').select().eq('pageId', page.id);
                if (error) {
                    console.log(error);
                    throw error;
                }
    
                // If no record exists create one, otherwise load data
                if (data.length == 0) {
                    const { error } = await supabase.from('canvases').insert({pageId: page.id});
                    if (error) {
                        console.log(error);
                        throw error;
                    }
                } else {
                    loadSnapshot(editor.store, {document: data[0].document});
                }
            }
            initialiseCanvas();
        } else {
            InitialiseCanvas(page.id).then((document) => {
                if (document !== null) {
                    loadSnapshot(editor.store, {document: JSON.parse(document)})
                }
            })
        }

        EventsOff("save")
        EventsOn("save", async () => {
            const { document, session } = getSnapshot(editor.store);
            
            if (page.cloud) {
                // Test if a record in table Canvases exists for current page id
                const {data, error} = await supabase.from('canvases').select().eq('pageId', page.id);
                if (error) {
                    console.log(error);
                    throw error;
                }
    
                // If no record exists create one, otherwise update the record
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
            } else {
                SaveCanvas(page.id, JSON.stringify(document))
            }
        })
    }, [page])

    return null;
}