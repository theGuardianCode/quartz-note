import * as React from 'react';
import { useState } from 'react';
import Editor from './Editor.jsx';
import Viewer from './Viewer.jsx';

const App = () => {
    const [filePath, setFilePath] = useState('Untitled');
    const [buffer, setBuffer] = useState('');

    const [editing, setEditing] = useState(false);

    const handleToggle = () => {
        setEditing(!editing);
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
            <h1>quartz notez</h1>
            <h3>{filePath}</h3>
            <button onClick={handleToggle}>Toggle</button>
            <button onClick={handleSave}>Save</button>
            <Editor isEditing={editing} buffer={buffer} setBuffer={setBuffer}/>
            <Viewer isEditing={editing} buffer={buffer}/>
        </>
    );
};

export default App;