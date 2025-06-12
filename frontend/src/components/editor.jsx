import { useRef, useEffect } from "preact/hooks";
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import { v4 as uuidv4 } from 'uuid';

import { EventsOn } from '../../wailsjs/runtime/runtime';
import { supabase } from "../../connection";
import updateDatabase from "../updateDatabase";

import './editor.css';

export function Editor({ data, pageId, pageName }) {
    let editor = useRef(null);
    let activePage = useRef(pageId);

    useEffect(() => {
        // Create editor
        editor.current = new EditorJS({
            holder: 'editorjs',
            tools: {
                header: Header
            },
        });

        // Wails save event listener
        EventsOn("save", () => {
            editor.current.save().then(async (output) => {
                updateDatabase(output.blocks, activePage.current, (success, err) => {
                    if (success) {
                        console.log("Blocks saved successfully!");
                        // Reload editor data to sync with db
                        editor.current.isReady.then(() => {
                            editor.current.render(data);
                        })
                    } else {
                        console.log(`Error saving blocks:`)
                        console.log(err)
                    }
                });
            })
        })
    }, []);

    useEffect(() => {
        // Change content when data prop changes
        if (editor.current) {
            editor.current.isReady.then(() => {
                editor.current.render(data);
            })
        }
    }, [data])

    useEffect(() => {
        // Change active page when prop changes
        activePage.current = pageId;
    }, [pageId]);

    return (
        <div>
            <span class="title-container"><h2>{pageName}</h2></span>
            <div id="editorjs"></div>
        </div>
    );
}