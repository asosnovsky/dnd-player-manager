import * as React from "react";
import { Tokens, Formulas } from '@/attr-parser/typings';
import { Paper, MenuList, MenuItem, Typography, TextField, FormControl, Input, Button, Grid } from '@material-ui/core';
import Notifier from '@/components/layouts/Notifier';
import { convertTokensToAST, convertASTtoTokens } from '@/attr-parser/convertor';
import { isOperation, isBrace } from '@/attr-parser/util';

import {
    IProps,
    Position,
    IState,
    RefBuilderItem,
    functionalOperations,
} from "./types";
import { updateRefs, selectItem } from '@/components/common/FormulaEditor/util';

export default class FormulaEditor extends React.Component<IProps, IState> {
    componentWillMount() { this.componentWillReceiveProps(this.props) };
    componentWillReceiveProps(nextProps: IProps) {
        if ( !this.state || nextProps.refs !== this.props.refs || nextProps.formula !== this.props.formula ) {
            this.reset();
            if ( nextProps.formula ) {
                this.setState({
                    tokens: convertASTtoTokens(nextProps.formula, nextProps.refs),
                })
            }
        }
    }
    reset = () => {
        this.setState({
            tokens: [],
            posStart: { token: -1, tokenPos: 0 },
            posEnd: { token: -1, tokenPos: 0 },
            refBuilder: undefined,
        })
    }
    createResetRefBuilderState = (tokens: IState["tokens"]) => {
        if (this.state.refBuilder) {
            tokens.splice(this.state.refBuilder.tokenIdx, 1);
            return {
                tokens,
                refBuilder: undefined as any,
            }
        }
        return { tokens };
    }
    updateRefs = (text: string, type: Tokens.NonChar["type"], selectedIdx:number = 0) => {
        this.setState(updateRefs(this.props.refs, this.state)(
            text, type, selectedIdx,
        ))
    }
    onSave = () => {
        if (this.props.onSave) {
            this.props.onSave(convertTokensToAST(this.state.tokens));
        }   else    {
            console.log(convertTokensToAST(this.state.tokens));
        }
    }
    onSelectItem = (selectedIdx: number ) => {
        const update = selectItem(this.state)(selectedIdx);
        this.setState(update as any)
    }
    onSingleChar = (key: string) => {
        const { tokens , posStart } = this.state;
        if ( this.state.refBuilder ) {
            if (key.match(/[\w|\d]/i)) {
                this.updateRefs(this.state.refBuilder.text + key, this.state.refBuilder.type);
            }   else    {
                Notifier.notify("Functions/References can only be numbers or letters.")
            }
        }   else    {
            if ( key.match(/[A-Z]/i) ) {
                return this.updateRefs(key, "func");
            }
            const update = this.createResetRefBuilderState(tokens);
            
            const hasDupOp = (s: string) => ["*", "/"].includes(s);
            const notInStart = posStart.token > -1;
            if ( notInStart && hasDupOp(key) && hasDupOp(update.tokens[posStart.token].value) ) {
                update.tokens[posStart.token].value += key;
                posStart.tokenPos = 1
            } else {
                let value: string = '\u00A0';
                if ( key.match(/[0-9|,]/) ) {
                    value = key;
                }   else
                if ( isOperation(key) || isBrace(key) ) {
                    value = key;
                }   else    {
                    console.warn("Ignoring", key)
                }
                update.tokens.splice(posStart.token + 1, 0, {
                    value,
                })
                posStart.tokenPos = 1
                posStart.token += 1
            }
            this.setState({
                ...update,
                posStart,
                posEnd: posStart,
            })
        }
    }
    onDelete = () => {
        const {tokens , posStart, posEnd} = this.state;
        if ( this.state.refBuilder && this.state.refBuilder.text.length > 1 ) {
            const { text } = this.state.refBuilder;
            this.updateRefs( text.slice(0, text.length - 1), this.state.refBuilder.type )
        }   else if ( tokens.length === 1 || tokens.length === posEnd.token - posStart.token + 1 ) {
            this.reset();
        }   else  if ( tokens.length > 1)   {
            if ( posStart.token < posEnd.token ) {
                const update = this.createResetRefBuilderState(tokens);
                update.tokens.splice(posStart.token + 1, posEnd.token - posStart.token);
                this.setState({
                    ...update,
                    posStart: { token: posStart.token, tokenPos: 1 },
                    posEnd: { token: posStart.token, tokenPos: 1 },
                })
            }   else if (posStart.token === posEnd.token)  {
                const update = this.createResetRefBuilderState(tokens);
                update.tokens.splice(posStart.token, 1);
                const token = Math.max(0, posStart.token - 1);
                const pos:Position = { token, tokenPos: posStart.token === 0 ? 0 : 1 }
                this.setState({
                    ...update,
                    posStart: pos,
                    posEnd: pos,
                })
            }
        }
    }
    onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if ( [ 116 ].includes(e.keyCode) ) {
            return;
        }
        e.preventDefault();
        const {tokens , posStart, posEnd} = this.state;
        if ( e.key === "@" ) {
            this.updateRefs("", "ref");
        }   else if (e.ctrlKey && e.key.toLowerCase() === "a") {
            this.setState({
                ...this.createResetRefBuilderState(tokens),
                posStart: { token: 0, tokenPos: 0 },
                posEnd: { token: tokens.length - 1, tokenPos: 1 },
            })
        }   else if (e.ctrlKey && e.key === "Enter") {
            this.onSave();
        }   else if ( e.key.length === 1) {
            this.onSingleChar(e.key);
        }   else if (["Backspace", "Delete"].includes(e.key)) {
            this.onDelete();
        }   else if( e.key === "ArrowLeft" ) {
            let update:Position;
            if (posStart.token > 0)  {
                update = { token: posStart.token - 1, tokenPos: posStart.tokenPos };
            }   else    {
                update = { token: 0, tokenPos: 0 };
            }
            if (update) {
                if (e.shiftKey) {
                    this.setState({ ...this.createResetRefBuilderState(tokens), posStart: update });
                }   else    {
                    this.setState({ ...this.createResetRefBuilderState(tokens), posStart: update, posEnd: update });
                }
            }
        }   else if( e.key === "ArrowRight" ) {
            let update:Position;
            if ( posEnd.token < tokens.length - 1 ) {
                update = { token: posEnd.token + 1, tokenPos: posEnd.tokenPos }
            } else if ( posEnd.token === tokens.length - 1 ) {
                update = { ...posEnd, tokenPos: 1}
            }

            if (update) {
                if (e.shiftKey) {
                    this.setState({ ...this.createResetRefBuilderState(tokens), posEnd: update });
                }   else    {
                    this.setState({ ...this.createResetRefBuilderState(tokens), posStart: update, posEnd: update });
                }
            }
        }   else if( this.state.refBuilder ) {
            const { text, items, selectedIdx } = this.state.refBuilder;
            if (e.key === "ArrowDown") {
                if ( selectedIdx < items.length - 1) {
                    this.updateRefs(text, this.state.refBuilder.type, selectedIdx + 1)
                }
            }   else if (e.key === "ArrowUp") {
                if (selectedIdx > 0) {
                    this.updateRefs(text, this.state.refBuilder.type, selectedIdx - 1)
                }
            }   else    if (e.key === "Enter") {
                this.onSelectItem(selectedIdx);
            }
        }
    }
    onElement = ( elm: HTMLDivElement ) => {
        const { state: { posStart, posEnd } } = this;
        const range = document.createRange();
        const sel = window.getSelection();
              sel.removeAllRanges();
        if (posStart.token > -1) {
            try {
                range.setStart(elm.childNodes[posStart.token], posStart.tokenPos );
                range.setEnd(elm.childNodes[posEnd.token], posEnd.tokenPos );
                sel.addRange(range);
            }catch(e) {
                console.error(e);
                console.log(posStart, posEnd);
            }
        }  
    } 
    setCurToEnd = () => {
        const { tokens } = this.state;
        this.setState({
            posStart: { token: tokens.length - 1, tokenPos: 1 },
            posEnd: { token: tokens.length - 1, tokenPos: 1 },
        })
    }
    renderChildren = () => {
        return this.state.tokens.map( (token, i) => {
            if ("type" in token) {
                return <span key={i} title={token.type}>{token.type === "func" ? `${token.value}(` : `${token.value}`}</span>
            }   else    {
                return <span key={i}>{token.value}</span>
            }
        });
    }
    renderAutoComplete = () => {
        if (this.state.refBuilder) {
            return <Paper elevation={10} style={{ marginTop: '10px' }}>
                <MenuList>
                    {this.state.refBuilder.items.map( (item, idx) => 
                        <MenuItem key={item.key} 
                                  style={{ backgroundColor: idx === this.state.refBuilder.selectedIdx ? "#dedddd" : null }}
                                  onClick={ e => this.onSelectItem(idx) }>
                            {item.html} ({"type" in item ? item.type : "func" })
                        </MenuItem>
                    )}
                </MenuList>
            </Paper>
        }
    }
    render() {
        return (
            <FormControl>
                    <Paper elevation={2}>
                        <div suppressContentEditableWarning contentEditable onKeyDown={this.onKeyUp} 
                                style={{
                                    width: "50vh",
                                    fontSize: '1rem',
                                    padding: '12px 10px 7px',
                                }}
                                ref={ elm => elm && this.onElement(elm) }
                                onClick={ e => { e.preventDefault(); console.log(e); this.onElement(e.currentTarget )} }
                                onDoubleClick={ e => { e.preventDefault(); this.setCurToEnd() } }
                                children={this.renderChildren()}
                        />
                    </Paper>
                    <Button color="primary" variant="raised" onClick={this.onSave}>Save</Button>
                    {this.renderAutoComplete()}
            </FormControl>
        )
    }
}
