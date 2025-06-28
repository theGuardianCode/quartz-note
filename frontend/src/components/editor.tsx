import { useRef, useEffect, useState } from "react";
import { ChatPane } from "./chat";

import EditorJS, { EditorConfig, OutputData, ToolConstructable } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import EditorjsList from '@editorjs/list';
import Desmos from "../blocks/desmos";
import KatexMath from "../blocks/katex-math";
import CodeBlock from "../blocks/code";

import { EventsOn } from '../../wailsjs/runtime/runtime';
import updateDatabase from "../updateDatabase";
import { supabase } from "../../connection";

import './editor.css';

type EditorProps = {
    initialData: any;
    pageId: string | undefined;
    pageName: string | undefined;
};

export function Editor({ initialData, pageId, pageName }: EditorProps) {
    const editor = useRef<EditorJS | null>(null);
    const activePage = useRef<string | undefined>(pageId);
    const hasInitialised = useRef(false);
    const [data, setData] = useState<OutputData>(initialData);
    const [showChat, setShowChat] = useState(false);

    function saveData() {
        if (editor.current && hasInitialised.current) {
            editor.current.isReady.then(() => {
                editor.current?.save().then(async (output) => {
                    setData(output)
                    updateDatabase(output.blocks, activePage.current!, (success: boolean, err: any) => {
                        if (success) {
                            console.log("Blocks saved successfully!");
                        } else {
                            console.log(`Error saving blocks:`)
                            console.log(err)
                        }
                    });
                });
            });
        }
    }

    useEffect(() => {
        // Create editor
        const editorConfig: EditorConfig = {
            holder: 'editorjs',
            data: initialData,
            tools: {
                header: Header,
                graph: Desmos,
                math: KatexMath,
                code: CodeBlock,
                list: {
                    class: EditorjsList as unknown as ToolConstructable,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                }
            },
        }
        
        editor.current = new EditorJS(editorConfig);
        hasInitialised.current = true;

        // Wails save event listener
        EventsOn("save", saveData);
    }, []);

    useEffect(() => {
        // Change content when data prop changes
        if (editor.current && hasInitialised.current) {
            editor.current.isReady.then(() => {
                editor.current?.render(initialData);
            })
        }
    }, [initialData])

    useEffect(() => {
        // Change active page when prop changes
        activePage.current = pageId;
    }, [pageId]);

    return (
        <>
            <div className="editor-container">
                <span className="title-container"><h2>{pageName}</h2></span>
                <div id="editorjs"></div>
            </div>
            {showChat ? <ChatPane pageContents={data.blocks} pageId={pageId} hideChat={() => setShowChat(false)}/> : <button onClick={() => setShowChat(true)}>&lt;</button> }
        </>
    );
}