import { useEffect, useState } from "react";
import { supabase } from "../../connection";
import { Editor } from "./editor";
import { Canvas } from "./canvas";

type PageSchema = {
    id: string;
    name: string;
    type: string;
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
    const [blocks, setBlocks] = useState<BlockSchema>();

    useEffect(() => {
        async function fetchBlocks() {
            // Retrieve blocks from supabase
            const { data, error } = await supabase.from('blocks').select().order('created_at', {ascending: true}).eq("pageId", page.id);
            let schema: BlockSchema = {
                time: new Date().getTime(),
                blocks: [],
                version: "2.31.0-rc.7"
            }
        
            // Format in editor.js format
            data?.forEach(block => {
                schema.blocks.push({id: block.id, type: block.type, data: block.data});
            })
        
            setBlocks(schema);
        }

        if (page.type == "note") fetchBlocks();
    }, [page])

    if (page.type == "note") {
        return <Editor initialData={blocks} page={page} />
    } else {
        return <Canvas page={page}/>;
    }
}