import * as React from "react";
import { Formulas, Attributes } from '@/attr-parser/typings';
import { Typography } from '@material-ui/core';
import { stringifyFormula } from '@/attr-parser/convertor';

interface IProps { 
    expression: Formulas.Expression; 
    getRef: (path: string) => Attributes.ReferentiableAttribute
};
interface IState { expression: Formulas.Expression };
export default class FormulaEditor extends React.Component<IProps, IState> {
    state = { expression: this.props.expression }
    componentWillReceiveProps(nextProps: IProps) {
        this.setState({ expression: nextProps.expression })
    }
    get text() {
        return stringifyFormula(this.state.expression);
    }
    render() {
        // return <Typography>
        //     {this.text}
        // </Typography>
        return <Expression expression={this.props.expression} getRef={this.props.getRef}/>
    }
}

interface IExpressionProps {
    expression: Formulas.Expression;
    withBracket?: boolean;
    getRef: (path: string) => Attributes.ReferentiableAttribute
}
export class Expression extends React.Component<IExpressionProps> {

    render() {
        const children = this.props.expression.operands.map( (operand, idx) => {
            let Child:React.ComponentType;
            switch (operand.type) {
                case "exprs":
                    Child = () => <Expression expression={operand} getRef={this.props.getRef} withBracket/>;
                    break;
                case "ref-value":
                    Child = () => <RefValue value={operand.value} getRef={this.props.getRef}/>
                    break;

                case "value":
                    Child = () => <Value value={operand.value}/>
                    break;

                default:
                    Child = () => <i>[[N/A]]</i>
                }
            return <span key={idx}>
                {(idx > 0) && this.props.expression.operation}
                <Child/>
            </span>
        } )
        if (this.props.withBracket) {
            return <span>({...children})</span>
        }   else    {
            return <span>{...children}</span>
        }
    }

}

class RefValue extends React.Component<{value:string; getRef: (path: string) => Attributes.ReferentiableAttribute}> {
    render() {
        const ref = this.props.getRef(this.props.value);
        if (ref) {
            return <b>{ref.name}</b>
        }
        return <b>{this.props.value}</b>
    }
}

class Value extends React.Component<{value:number}> {
    render() {
        return <span>{this.props.value}</span>
    }
}
