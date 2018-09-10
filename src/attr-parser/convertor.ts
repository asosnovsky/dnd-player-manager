import { Formulas, Attributes, Tokens, BRACES, OPEN_BRACE, CLOSE_BRACE, OPERATION_PRIORITY } from '@/attr-parser/typings';
import Referenciables from '@/attr-parser/Referenciables';
import { OPERATIONS } from '@/attr-parser/evaluators';
import Expression from '@/attr-parser/Expression';
import { isFunction } from '@/attr-parser/util';

export function stringifyFormula(formula: Formulas.Expression, withBracket?:boolean) : string {
    let str = formula.operands.reduce( (s, operand, idx) => {
        if (idx > 0) {
            if ( isFunction(formula.operation) ) {
                if ( idx < formula.operation.length - 1 ) {
                    s += ','
                }
            }   else    {
                s += formula.operation;
            }
        }
        switch(operand.type) {
            case "exprs": return s + stringifyFormula(operand, true);
            case "value": return s + operand.value;
            case "ref-value": return s + operand.value;
            default: return s;
        }
    }, "" )
    if ( isFunction(formula.operation) ) {
        str = `${formula.operation}(${str})`
    }
    if (withBracket) {
        str = "(" + str + ")";
    }

    return str;
}

export function getAllReferanciables(tree: Attributes.Category) {
    return new Referenciables(tree);
}

export function convertASTtoTokens( formula: Formulas.Expression, refs: Referenciables ) : Tokens.Token[] {
    let tokens: Tokens.Token[] = [];
    if ( isFunction(formula.operation) ) {
        tokens.push({
            type: "func",
            value: formula.operation as Formulas.Functions,
        })
    } 

    formula.operands.forEach( (operand, idx) => {
        switch(operand.type) {
            case "exprs": 
                tokens = tokens.concat([
                    { value: "(" },
                    ...convertASTtoTokens(operand, refs),
                    { value: ")" },
                ])
                break;
            case "value": 
                tokens.push({
                    value: String(operand.value),
                })
                break;
            case "ref-value": 
                tokens.push({
                    type: "ref",
                    ref: operand.value,
                    value: refs.getRef(operand.value, true).name,
                })
                break;
            default: console.warn("Invalid type for operand", operand);
        }
        if ( idx < formula.operands.length - 1 ) {
            if ( isFunction(formula.operation) ) {
                tokens.push({ value: " " });
            }   else    {
                tokens.push({ value: formula.operation });
            }
        }
    });

    return tokens;
}

export function convertTokensToAST(tokens: Tokens.Token[]): Formulas.Expression {
    const tree = new Expression();

    let currentExprs: Expression = tree;
    let braces: CLOSE_BRACE[] = [];

    for (const token of tokens) {
        if ( token.value.trim() === "" ) {} else
        if ( "type" in token ) {
            switch(token.type) {
                case "ref":
                    currentExprs.pushRef(token.ref);
                    break;
                case "func":
                    if ( token.value !== "") {
                        braces.push(")");
                        currentExprs = currentExprs.makeChild(token.value)
                    }   else    {
                        console.warn("Empty func is recieved...", token);
                    }
            }
        }   else if ( token.value in BRACES ) {
            const openBrace = token.value as OPEN_BRACE;
            braces.push(BRACES[openBrace]);
            currentExprs = currentExprs.makeChild(null);
        }   else if ( braces.indexOf(token.value as any) > -1) {
            if ( braces[braces.length - 1] === token.value && currentExprs.parent ) {
                braces.splice(braces.length - 1, 1);
                currentExprs = currentExprs.parent;
            }   else    {
                throw new Error("Invalid syntax");
            }
        }   else if ( !isNaN(Number(token.value)) ) {
            currentExprs.pushNum(Number(token.value))
        }   else    if (token.value in OPERATION_PRIORITY) {
            const operation = token.value as Formulas.Operation;
            currentExprs = currentExprs.getParentThroughOperation(operation);
        }   else    {
            console.warn(`Ignoring...`, token)
        }
    }

    if (tree.operation === null) {
        if ( tree.operands.length > 1 ) {
            tree.operation = OPERATIONS.ADDITION;
        }else{
            console.error(tree);
            throw new Error("Missing operation...")
        }
    }

    return tree.toJSON()
}