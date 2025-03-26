import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Editor from './Editor.jsx';
import Viewer from './Viewer.jsx';

const App = () => {
    const [filePath, setFilePath] = useState('');
    const [buffer, setBuffer] = useState('');

    const [editing, setEditing] = useState(false);

    const history = useRef([]);

    // Set electron api handlers
    useEffect(() => {
        window.myFS.onOpenFile((path, contents) => {
            history.current.push(path);
            
            setFilePath(() => path);
            setBuffer(() => contents);
        })
    
        window.myFS.onNavigateBack( async () => {
            if (history.current.length > 0) {
                history.current.pop();
                await changeFile(history.current[history.current.length - 1]);
            }
        })
    }, [])


    const handleToggle = () => {
        setEditing(!editing);
    }

    const handleSave = async () => {
        await window.myFS.writeFile(filePath, buffer);
    }

    const changeFile = async (path) => {
        await window.myFS.openFile(path);
    }

    return (
        <>
            <h1>quartz notez</h1>
            <h3>{filePath}</h3>
            <button onClick={handleToggle}>Toggle</button>
            <button onClick={handleSave}>Save</button>
            {filePath == "" 
                ? <h3>No file selected</h3> 
                : <span><Editor isEditing={editing} buffer={buffer} setBuffer={setBuffer}/>
            <Viewer isEditing={editing} buffer={buffer} setFilePath={changeFile}/></span>}
            
        </>
    );
};

export default App;