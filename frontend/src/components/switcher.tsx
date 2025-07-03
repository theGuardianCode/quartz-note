import { useEffect, useState } from "react";
import { supabase } from "../scripts/connection";
import { Editor } from "./editor";
import { Canvas } from "./canvas";
import { ListBlocks } from "../../wailsjs/go/main/Database";

type PageSchema = {
    id: string;
    name: string;
    type: string;
    cloud: boolean;
};

type BlockSchema = {
    time: number;
    blocks: any[];
    version: string;
};

type SwitcherProps = {
    page: PageSchema
};

export function Switcher({page}: SwitcherProps) {
    const [loadedBlocks, setLoadedBlocks] = useState<BlockSchema>();

    useEffect(() => {
        async function fetchBlocks() {
            if (page.cloud) {
                // Retrieve blocks from supabase
                const { data, error } = await supabase.from('blocks').select().order('created_at', {ascending: true}).eq("pageId", page.id);
                let schema: BlockSchema = {
                    time: new Date().getTime(),
                    blocks: [],
                    version: "2.31.0-rc.7"
                };
            
                // Format in editor.js format
                data?.forEach(block => {
                    schema.blocks.push({id: block.id, type: block.type, data: block.data});
                });
            
                setLoadedBlocks(schema);
            } else {
                ListBlocks(page.id).then(blocks => {
                    let schema: BlockSchema = {
                        time: new Date().getTime(),
                        blocks: [],
                        version: "2.31.0-rc.7"
                    }

                    blocks.forEach(block => {
                        schema.blocks.push({id: block.id, type: block.type, data: block.data ? JSON.parse(block.data) : null})
                    });

                    setLoadedBlocks(schema);
                });
            }
        }

        if (page.type == "note") fetchBlocks();
        console.log(page)
    }, [page])

    if (page.type == "note") {
        return <Editor initialData={loadedBlocks} page={page} />
    } else if (page.type == "canvas") {
        return <Canvas page={page}/>;
    }
}