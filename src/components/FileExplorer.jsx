import * as React from 'react';
import { useState, useEffect } from 'react';

const compare = (a, b) => {
    return a.name.localeCompare(b.name);
}

const FileExplorer = ({fileList, setFileList, changeFile}) => {
    const [listItems, setListItems] = useState([]);

    useEffect(() => {
        if (fileList != null) {
            const lis = fileList.map((file) => {
                return <li key={file.id} onClick={() => handleClick(file)}>{file.name}</li>
            });
            setListItems(lis);
        }
    }, [fileList]);

    const handleClick = (file) => {
        if (!file.dir) {
            changeFile(file.absolutePath);
        } else {
            handleFolder(file);
        }
    }

    const handleFolder = async (folder) => {
        const dirContents = await window.myFS.openFolder(folder.absolutePath);
        
        for (let file = 0; file < dirContents.length; file++) {
            dirContents[file].name = folder.name + "\\" + dirContents[file].name;
        }

        setFileList((oldList) => [...oldList, ...dirContents].sort(compare));
    };

    return (
        <>
            <ul>{listItems}</ul>
        </>
    );
};

export default FileExplorer;