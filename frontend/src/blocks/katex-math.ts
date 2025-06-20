import katex from 'katex';
import 'katex/dist/katex.min.css';
import './katex-math.css';
import { BlockTool } from '@editorjs/editorjs';

export default class KatexMath implements BlockTool {
    mathString: string;
    wrapper: HTMLDivElement | undefined;
    display: HTMLDivElement | undefined;
    input: HTMLInputElement | undefined;
    editMode: boolean;

    constructor({data}: any) {
        this.mathString = data.string ? data.string : "";

        this.wrapper = undefined;
        this.display = undefined;
        this.input = undefined;

        this.editMode = this.mathString == "" ? true : false;
    }

    static get toolbox() {
        return {
            title: 'Math'
        }
    }

    render() {
        // Create container element
        this.wrapper = document.createElement('div');

        // Create element to hold Katex
        this.display = document.createElement('div');
        this.display.addEventListener('click', () => {
            this._toggleView();
        });
        if (!this.editMode) {
            this.wrapper.appendChild(this.display);
        }

        // Create element to take input in latex
        this.input = document.createElement('input');
        this.input.classList.add('math-input');
        this.input.value = this.mathString;
        this.input.oninput = (event) => {
            this.mathString = (event.target as HTMLInputElement).value;
            katex.render(String.raw`${this.mathString}`, this.display as HTMLElement, {
                throwOnError: false
            });
        };
        this.input.onkeydown = (event) => {
            if (event.key == 'Enter') {
                event.preventDefault();
                this._toggleView();
            }
        }
        if (this.editMode) {
            this.wrapper.appendChild(this.input);
        }

        katex.render(String.raw`${this.mathString}`, this.display, {
            throwOnError: false
        });

        return this.wrapper;
    }

    save() {
        return {
            string: this.mathString
        }
    }

    _toggleView() {
        this.editMode = !this.editMode;
        if (this.wrapper) {
            if (this.editMode) {
                this.wrapper.removeChild(this.display as Node);
                this.wrapper.appendChild(this.input as Node);
                this.input?.focus()
            } else {
                this.wrapper.removeChild(this.input as Node);
                this.wrapper.appendChild(this.display as Node);
            }
        }
    }
}