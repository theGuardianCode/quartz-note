import Markdown from 'react-markdown';
import * as React from 'react';

const Viewer = ({isEditing, buffer}) => {
    if (!isEditing) {
        return (
            <Markdown>
                {buffer}
            </Markdown>
        );
    }

    return null;
}

export default Viewer;