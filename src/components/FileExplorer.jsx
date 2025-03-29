import * as React from 'react';

const FileExplorer = ({fileList, changeFile}) => {
    const listItems = fileList.map((filePath) => {
        return <li onClick={() => changeFile(filePath)}>{filePath}</li>
    });

    return (
        <>
            <ul>{listItems}</ul>
        </>
    );
};

export default FileExplorer;