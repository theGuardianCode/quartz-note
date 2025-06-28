import { BlockTool } from "@editorjs/editorjs";
import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";

export default class CodeBlock implements BlockTool {
    api: any;
    data: any;
    editor: EditorView | undefined;

    constructor({data, api}: any) {
        this.api = api;
        this.data = data;
    }

    static get toolbox() {
        return {
            title: "Code"
        }
    }

    render() {
        const wrapper = document.createElement('div');
        let editorConfig: any = {
            extensions: [
                basicSetup,
                keymap.of([indentWithTab]),
                python()
            ],
            parent: wrapper,
            doc: this.data.editor ?? ""
        }

        this.editor = new EditorView(editorConfig);

        wrapper.addEventListener("keydown", (e) => {
            e.stopPropagation();
        });

        wrapper.addEventListener("keyup", (e) => {
            e.stopPropagation();
        });

        return wrapper;
    }

    save() {
        return {
            editor: this.editor?.state.doc.toString()
        }
    }
}