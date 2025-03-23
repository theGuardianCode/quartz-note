import * as React from 'react';
import { useState } from 'react';

const Editor = () => {
    const [filePath, setFilePath] = useState('Untitled');
    const [buffer, setBuffer] = useState('');

    const handleChange = event => {
        setBuffer(event.target.value);
    }

    const handleSave = async () => {
        await window.myFS.writeFile(filePath, buffer);
    }

    window.myFS.onOpenFile((filePath, contents) => {
        setFilePath(filePath);
        setBuffer(contents);
    })

    return (
        <>
            <h3>{filePath}</h3>
            <textarea rows="20" onChange={handleChange} value={buffer}></textarea><br/>
            <p>{buffer}</p>
            <button onClick={handleSave}>Save</button>
        </>
    );
};

export default Editor;