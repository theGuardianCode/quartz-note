import { useRef, useEffect, useState } from "react";
import { ChatPane } from "./chat";

import EditorJS, { EditorConfig, OutputData, ToolConstructable } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import EditorjsList from '@editorjs/list';
import Desmos from "../blocks/desmos";
import KatexMath from "../blocks/katex-math";
import CodeBlock from "../blocks/code";

import { EventsOn } from '../../wailsjs/runtime/runtime';
import updateDatabase from "../scripts/updateDatabase";

import './editor.css';
import { ProcessTransaction } from "../../wailsjs/go/main/Database";

type PageSchema = {
    id: string;
    name: string;
    type: string;
    cloud: boolean;
};

type EditorProps = {
    initialData: any;
    page: PageSchema;
};

export function Editor({ initialData, page }: EditorProps) {
    const editor = useRef<EditorJS | null>(null);
    const activePage = useRef<PageSchema | undefined>(page);
    const hasInitialised = useRef(false);
    const [data, setData] = useState<OutputData>(initialData);
    const [showChat, setShowChat] = useState(false);

    function saveData() {
        if (editor.current && hasInitialised.current) {
            editor.current.isReady.then(() => {
                editor.current?.save().then(async (output) => {
                    setData(output);
                    if (activePage.current?.cloud) {
                        updateDatabase(output.blocks, activePage.current?.id!, (success: boolean, err: any) => {
                            if (success) {
                                console.log("Blocks saved successfully!");
                            } else {
                                console.log(`Error saving blocks:`)
                                console.log(err)
                            }
                        });
                    } else {
                        const serialisedBlocks = output.blocks.map((block) => {
                            return ({
                                id: block.id!,
                                pageId: activePage.current?.id!,
                                created_at: Math.floor(new Date().getTime() / 1000),
                                type: block.type,
                                data: JSON.stringify(block.data)
                            });
                        });
                        ProcessTransaction(serialisedBlocks, activePage.current?.id!)
                    }
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
        setData(initialData)
    }, [initialData])

    useEffect(() => {
        // Change active page when prop changes
        activePage.current = page;
    }, [page]);

    return (
        <>
            <div className="editor-container">
                <span className="title-container"><h2>{page.name}</h2></span>
                <div id="editorjs"></div>
            </div>
            {showChat ? <ChatPane pageContents={data.blocks} page={page} hideChat={() => setShowChat(false)}/> : <button onClick={() => setShowChat(true)}>&lt;</button> }
        </>
    );
}