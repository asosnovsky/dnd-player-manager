import * as React from "react";
import { IState, RefBuilder, RefBuilderItem, functionalOperations } from '@/components/common/FormulaEditor/types';
import { Tokens, Formulas } from '@/attr-parser/typings';
import Referenciables from '@/attr-parser/Referenciables';
import Notifier from '@/components/layouts/Notifier';

export const updateRefs = (
    refs: Referenciables, 
    state: IState
) => (text: string, type: Tokens.NonChar["type"], selectedIdx:number = 0) : IState => {
        
    const regexp = new RegExp(`(.*)(${text})(.*)`, "i");
    const { posStart, tokens } = state;
    let items: RefBuilderItem[];
    let token: Tokens.NonChar;
    let tokenIdx: number;
    
    if (!state.refBuilder || text !== state.refBuilder.text) {
        if ( type === "ref" ) {
            token = { type, value: "", ref: "" }
            items = refs.items.filter( item => item.name.match(regexp) ).map( item => {
                const m = item.name.match(regexp);
                const [ pre, mid, post] = m.slice(1);
                return {
                    ...item,
                    html: <span>{pre}<b>{mid}</b>{post}</span>
                }
            });
        }   else if ( type === "func" )   {
            token = { type, value: "" }
            items = functionalOperations.filter( op => op.match(regexp) ).map( op => {
                const m = op.match(regexp);
                const [ pre, mid, post] = m.slice(1);
                return {
                    name: op as Formulas.Functions,
                    key: op as Formulas.Functions, 
                    html: <span>{pre}<b>{mid}</b>{post}</span>
                }
            } )
        }
    }   else    {
        items = state.refBuilder.items;
    }

    if (items.length === 0) {
        Notifier.notify("No such references...")
    }

    if (state.refBuilder) {
        tokenIdx = state.refBuilder.tokenIdx;
        tokens[tokenIdx].value = text;
    }   else    {
        tokens.splice(posStart.token + 1, 0, token)
        tokenIdx = posStart.token + 1;
        posStart.tokenPos = 1;
    }
    return {
        tokens,
        refBuilder: {
            text, items,
            selectedIdx,
            tokenIdx,
            type,
        },
        posStart, posEnd: posStart,
    }
}

export const selectItem = (
    state: IState
) => (selectedIdx: number ): Partial<IState> => {
    const { 
        refBuilder: { items, tokenIdx }, 
        tokens, 
        posStart, posEnd,
    } = state;
    if (items.length === 0) {
        tokens.splice(tokenIdx, 1);
        return {
            tokens, refBuilder: undefined,
        }
    }
    const selected = items[selectedIdx];
    const tokenSel = tokens[tokenIdx];
    if ( !("type" in tokenSel) ) {
        throw new Error(`Invalid Selected Token ${tokenSel}`)
    }
    
    if ( tokenSel.type === "func" ) {
        tokenSel.value = selected.name as Formulas.Functions;
        posStart.token ++;
    }   else if (tokenSel.type === "ref") {
        tokenSel.value = selected.name;
        tokenSel.ref = selected.key;
        posStart.token = tokenIdx;
    }
    
    posStart.tokenPos = 1;
    return {
        tokens,
        refBuilder: undefined,
        posStart, posEnd: posStart,
    }
}