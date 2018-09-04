import * as React from "react";
import { Formulas, Attributes, Tokens } from '@/attr-parser/typings';
import { stringifyFormula } from '@/attr-parser/convertor';
import { OPERATIONS } from '@/attr-parser/evaluators';
import { TextField } from '@material-ui/core';

interface IProps { 
    getRef?: (path: string) => Attributes.ReferentiableAttribute
};
interface Position {
    token: number;
    tokenPos: number;
}
interface IState { 
    tokens: Tokens.Token[];
    posStart: Position;
    posEnd: Position;

};
export default class FormulaEditor extends React.Component<IProps, IState> {
    componentWillMount() { this.componentWillReceiveProps(this.props) };
    componentWillReceiveProps(nextProps: IProps) {
        const state: IState = {
            tokens: [],
            posStart: {
                token: -1,
                tokenPos: 0,
            },
            posEnd: {
                token: -1,
                tokenPos: 0,
            }
        }
        // if (nextProps.)
        this.setState(state);
    }
    onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if ( [ 116 ].includes(e.keyCode) ) {
            return;
        }
        console.log(e.key, ["Backspace", "Del"].includes(e.key))
        e.preventDefault();
        const {tokens , posStart, posEnd} = this.state;
        if ( e.key.length === 1) {
            tokens.splice(posStart.token + 1, 0, {
                value: e.key === " " ? "\u00A0" : e.key,
            })
            this.setState({
                tokens: tokens,
                posStart: {
                    token: posStart.token + 1,
                    tokenPos: 0,
                },
                posEnd: {
                    token: posStart.token + 1,
                    tokenPos: 0
                }
            })
        }   else    if (["Backspace", "Delete"].includes(e.key)) {
            if ( tokens.length === 1) {
                this.setState({
                    tokens: [],
                    posStart: { token: -1, tokenPos: 0 },
                    posEnd: { token: -1, tokenPos: 1 },
                })
            }   else  if ( tokens.length > 1)   {
                console.log(posStart, posEnd)
                if ( posStart.token < posEnd.token ) {
                    tokens.splice(posStart.token + 1, posEnd.token - posStart.token);
                    let length: number = 0
                    if ( posEnd.token > 0) {
                        length = tokens[posStart.token].value.length - 1;
                    }
                    this.setState({
                        tokens,
                        posStart: { token: posStart.token, tokenPos: length },
                        posEnd: { token: posStart.token, tokenPos: length },
                    })
                }   else if (posStart.token === posEnd.token)  {
                    tokens.splice(posStart.token, 1);
                    const token = Math.max(0, posStart.token - 1);
                    const pos:Position = { token, tokenPos: token === 0 ? -1 : 0 }
                    this.setState({
                        tokens,
                        posStart: pos,
                        posEnd: pos,
                    })
                }
            }
        } else if( e.key === "ArrowLeft" ) {
            let update:Position;
            if (posStart.tokenPos > 0) {
                update = { ...posStart, tokenPos: posStart.tokenPos - 1 };
            }   else  if (posStart.token > 0 && posStart.tokenPos === 0)  {
                const length = tokens[posStart.token - 1].value.length;
                update = { token: posStart.token - 1, tokenPos: length - 1 };
            }   else if (posStart.token === 0 && posStart.tokenPos === 0 ) {
                update = { ...posStart, tokenPos: posStart.tokenPos - 1 };
            }   else  if (!e.shiftKey)  {
                update = posStart;
            }
            if (update) {
                if (e.shiftKey) {
                    this.setState({ posStart: update });
                }   else    {
                    this.setState({ posStart: update, posEnd: update });
                }
            }
        } else if( e.key === "ArrowRight" ) {
            let update:Position;

            const tokenEnd = tokens[posEnd.token];
            if (tokenEnd.value.length - 1 > posEnd.tokenPos) {
                update = { token: posEnd.token, tokenPos: posEnd.tokenPos + 1 }
            }   else  if ( posEnd.token < tokens.length - 1 ) {
                update = { token: posEnd.token + 1, tokenPos: 0 }
            }   else  if (!e.shiftKey)  {
                update = posEnd;
            }

            if (update) {
                if (e.shiftKey) {
                    this.setState({ posEnd: update });
                }   else    {
                    this.setState({ posStart: update, posEnd: update });
                }
            }
        }
    }
    onRef = ( elm: HTMLDivElement ) => {
        const { state: { posStart, posEnd } } = this;
        const range = document.createRange();
        const sel = window.getSelection();
              sel.removeAllRanges();
        if (posStart.token > -1) {
            range.setStart(elm.childNodes[posStart.token], posStart.tokenPos + 1 );
            range.setEnd(elm.childNodes[posEnd.token], posEnd.tokenPos + 1 );
            sel.addRange(range);
        }  
    } 
    setCurToEnd = () => {
        const { tokens } = this.state;
        const lastToken = tokens[tokens.length - 1];
        this.setState({
            posStart: { token: tokens.length - 1, tokenPos: lastToken.value.length - 1 },
            posEnd: { token: tokens.length - 1, tokenPos: lastToken.value.length - 1 },
        })
    }
    render() {
        console.log(this.state.posEnd, this.state.posStart);
        return <div 
            suppressContentEditableWarning contentEditable 
            style={{ border: "1px solid black" }}
            onKeyDown={this.onKeyUp} 
            ref={ elm => {
                if (elm) {
                    this.onRef(elm);
                }
            }}
            onClick={ e => {
                e.preventDefault();
                this.onRef(e.currentTarget);
            } }
            onDoubleClick={ e => {
                e.preventDefault();
                this.setCurToEnd();
            } }
        >{this.state.tokens.map( (token, i) => 
            <span key={i}>{token.value}</span> 
        )}</div>
        /*return <TextField
            component={ props => <div {...props} contentEditable/> }
            defaultValue={this.state.text}
            InputProps={{
                onKeyUp: 
            }} 
        />*/
    }
}
