import { OutputBlockData } from "@editorjs/editorjs";
import { supabase } from "../connection";

type CompleteBlock = OutputBlockData & {
    pageId: string | undefined;
};

export default async function updateDatabase(blocks: OutputBlockData<string, any>[], pageId: string, callback: Function) {
    const newBlockIds = blocks.map(block => block.id)

    // Get the blocks the user has permissions for (current page)
    const { data: blockData, error: blockError } = await supabase.from('blocks').select().eq('pageId', pageId);
    if (blockError) {
        console.log("Update failed at retrieving existing blocks");
        callback(false, blockError);
        return;
    }
    const existingBlockIds = blockData.map(block => block.id);

    // Test for any blockIds in database but not in <blocks> (deleted)
    for (const blockId of existingBlockIds) {
        if (!newBlockIds.includes(blockId)) {
            // console.log(`Deleted block with blockId ${blockId} and pageId ${pageId}`);
            const { error } = await supabase.from('blocks').delete().eq('id', blockId).eq('pageId', pageId);
            if (error) {
                console.log("Update failed at deleted blocks");
                callback(false, error);
                return;
            }
        }
    }

    // For each block already in the database, update its values
    for (const block of blocks) {
        if (existingBlockIds.includes(block.id)) {
            // console.log(`Updated block with blockId ${block.id} and pageId ${pageId}`);
            const { error } = await supabase.from('blocks').update(block).eq('id', block.id).eq('pageId', pageId);
            if (error) {
                console.log("Update failed at updating existing blocks");
                callback(false, error);
                return;
            }
        } else {
            // Create a new record for this block
            let completeBlock = structuredClone(block) as CompleteBlock;
            completeBlock.pageId = pageId;
            // console.log(`Creating block with blockId ${completeBlock.id} and pageId ${pageId}`);
            const { error } = await supabase.from('blocks').insert(completeBlock);
            if (error) {
                console.log("Update failed at storing new blocks");
                callback(false, error);
                return;
            }
        }
    }

    callback(true, null);
}