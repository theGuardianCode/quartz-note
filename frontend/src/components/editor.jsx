import { useRef, useEffect } from "preact/hooks";

import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import EditorjsList from '@editorjs/list';
import Desmos from "../blocks/desmos";
import KatexMath from "../blocks/katex-math";

import { EventsOn } from '../../wailsjs/runtime/runtime';
import updateDatabase from "../updateDatabase";

import './editor.css';

export function Editor({ initialData, pageId, pageName }) {
    let editor = useRef(null);
    let activePage = useRef(pageId);

    useEffect(() => {
        // Create editor
        editor.current = new EditorJS({
            holder: 'editorjs',
            tools: {
                header: Header,
                graph: Desmos,
                math: KatexMath,
                list: {
                    class: EditorjsList,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                }
            },
        });

        // Wails save event listener
        EventsOn("save", () => {
            editor.current.save().then(async (output) => {
                console.log(output);
                updateDatabase(output.blocks, activePage.current, (success, err) => {
                    if (success) {
                        console.log("Blocks saved successfully!");
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
                editor.current.render(initialData);
            })
        }
    }, [initialData])

    useEffect(() => {
        // Change active page when prop changes
        activePage.current = pageId;
    }, [pageId]);

    return (
        <div class="editor-container">
            <span class="title-container"><h2>{pageName}</h2></span>
            <div id="editorjs"></div>
        </div>
    );
}