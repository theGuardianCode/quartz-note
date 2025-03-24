import * as React from 'react';
import { useState } from 'react';

const Editor = ({isEditing, buffer, setBuffer}) => {
    const handleChange = event => {
        setBuffer(event.target.value);
    }

    if (isEditing) {
        return (
            <>
                <textarea rows="20" onChange={handleChange} value={buffer}></textarea><br/>
            </>
        );
    }

    return null;
};

export default Editor;