import { Attributes, Tokens, Formulas } from '@/attr-parser/typings';
import Referenciables from '@/attr-parser/Referenciables';

export interface IProps { 
    refs: Referenciables;
    formula?: Formulas.Expression;
    onSave?: (tree: Formulas.Expression) => void;
};
export interface Position {
    token: number;
    tokenPos: 1 | 0;
}
export type RefBuilderItem = (Attributes.ReferentiableAttribute | {
    name: Formulas.Functions;
    key: Formulas.Functions;
}) & { html: JSX.Element } 
export interface RefBuilder {
    text: string;
    tokenIdx: number;
    items: Array<RefBuilderItem>;
    selectedIdx: number;
    type: Tokens.NonChar["type"];
}
export interface IState { 
    tokens: Tokens.Token[];
    posStart: Position;
    posEnd: Position;
    refBuilder?: RefBuilder;

};
export const functionalOperations:Formulas.Functions[] = [ Formulas.Functions.MAX, Formulas.Functions.MIN ];
 