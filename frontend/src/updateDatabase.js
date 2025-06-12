import { supabase } from "../connection";

export default async function updateDatabase(blocks, pageId, callback) {
    const newBlockIds = blocks.map(block => block.id)

    // Get the blocks the user has permissions for (current page)
    console.log(`Page id: ${pageId}`);
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
            const { err } = await supabase.from('blocks').delete().eq('id', blockId).eq('pageId', pageId);
            if (err) {
                console.log("Update failed at deleted blocks");
                callback(false, err);
                return;
            }
        }
    }

    // For each block already in the database, update its values
    for (const block of blocks) {
        if (existingBlockIds.includes(block.id)) {
            // console.log(`Updated block with blockId ${block.id} and pageId ${pageId}`);
            const { err } = await supabase.from('blocks').update(block).eq('id', block.id).eq('pageId', pageId);
            if (err) {
                console.log("Update failed at updating existing blocks");
                callback(false, err);
                return;
            }
        } else {
            // Create a new record for this block
            let completeBlock = structuredClone(block);
            completeBlock.pageId = pageId;
            // console.log(`Creating block with blockId ${completeBlock.id} and pageId ${pageId}`);
            const { err } = await supabase.from('blocks').insert(completeBlock);
            if (err) {
                console.log("Update failed at storing new blocks");
                callback(false, err);
                return;
            }
        }
    }

    callback(true, null);
}