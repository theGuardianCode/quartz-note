import katex from 'katex';
import 'katex/dist/katex.min.css';
import './katex-math.css';

export default class KatexMath {
    constructor({data}) {
        this.mathString = data.string ? data.string : "\\frac{a}{b}";

        this.wrapper = undefined;
        this.display = undefined;
        this.input = undefined;

        this.editMode = true;
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

        // Create element to take input in latex
        this.input = document.createElement('input');
        this.input.classList.add('math-input');
        this.input.value = this.mathString;
        this.input.oninput = (event) => {
            this.mathString = event.target.value;
            katex.render(String.raw`${this.mathString}`, this.display, {
                throwOnError: false
            });
        };
        this.input.onkeydown = (event) => {
            if (event.key == 'Enter') {
                event.preventDefault();
                this._toggleView();
            }
        }
        this.wrapper.appendChild(this.input);

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
                this.wrapper.removeChild(this.display);
                this.wrapper.appendChild(this.input);
                this.input.focus()
            } else {
                this.wrapper.removeChild(this.input);
                this.wrapper.appendChild(this.display);
            }
        }
    }
}