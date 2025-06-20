import { BlockTool } from "@editorjs/editorjs";

export default class Desmos implements BlockTool {
    data: any;
    desmos: any;
    calculator: any;

    constructor({data}: any) {
        this.data = data;
    }

    static get toolbox() {
        return {
            title: 'Graph'
        }
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('desmos-calculator');

        const elt = document.createElement('div');
        elt.id = 'calculator';
        elt.setAttribute('style', 'width: 600px; height: 400px;');
        wrapper.appendChild(elt);

        const script = document.createElement('script');
        script.src = 'https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
        script.async = true;
        script.onload = () => {
            this.desmos = window.Desmos;
            this.calculator = this.desmos.GraphingCalculator(elt);

            if (this.data.calculator) {
                this.calculator.setState(this.data.calculator);
            } else {
                this.calculator.setExpression({ id: 'graph1', latex: 'y=x^2' })
            }
        }
        wrapper.appendChild(script);

        return wrapper;
    }

    save() {
        return {
            calculator: this.calculator.getState()
        }
    }
}