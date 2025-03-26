import Markdown from 'react-markdown';
import * as React from 'react';


const Viewer = ({isEditing, buffer, setFilePath}) => {
    if (!isEditing) {
        return (
            <Markdown
                components={{
                    a(props) {
                        const {children, href} = props;
                        return <a className="link" onClick={() => setFilePath(href)}>{children}</a>
                    }
                }}
            >{buffer}</Markdown>
        );
    }

    return null;
}

export default Viewer;