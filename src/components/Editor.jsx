import * as React from 'react';
import { useState, useEffect } from 'react';

const Editor = ({isEditing, buffer, setBuffer}) => {
    const handleChange = event => {
        setBuffer(event.target.value);
    }

    if (isEditing) {
        return (
            <>
                <textarea className="markdown-editor" rows="20" onChange={handleChange} value={buffer}></textarea><br/>
            </>
        );
    }

    return null;
};

export default Editor;