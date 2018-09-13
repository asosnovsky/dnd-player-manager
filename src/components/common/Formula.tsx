import * as React from "react";
import { Formulas, Attributes } from '@/attr-parser/typings';
import { stringifyFormula } from '@/attr-parser/convertor';
import { isFunction } from "@/attr-parser/util";

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
        const isFunc = isFunction(this.props.expression.operation);
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
            if (idx > 0 && !isFunc) {
                return <span key={idx}>
                    {this.props.expression.operation}
                    <Child/>
                </span>
            }   else    if (idx > 0 && isFunc ) {
                return <span key={idx}>
                    ,
                    <Child/>
                </span>
            }   else    return <Child key={idx}/>
        } )
        const Child = () => {
            if (isFunc) {
                return <span>{this.props.expression.operation}({...children})</span>
            }   else    {
                return <span>{...children}</span>
            }
        }
        if (this.props.withBracket && !isFunc) {
            return <span>(<Child/>)</span>
        }   else    {
            return <Child/>
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
