import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
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
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
            >{buffer}</Markdown>
        );
    }

    return null;
}

export default Viewer;