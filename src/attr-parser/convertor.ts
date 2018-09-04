import { Formulas, Attributes } from '@/attr-parser/typings';

export function stringifyFormula(formula: Formulas.Expression, withBracket?:boolean) : string {
    const str = formula.operands.reduce( (s, operand, idx) => {
        if (idx > 0) {
            s += formula.operation;
        }
        switch(operand.type) {
            case "exprs": return s + stringifyFormula(operand, true);
            case "value": return s + operand.value;
            case "ref-value": return s + operand.value;
            default: return s;
        }
    }, "" )
    if (withBracket) {
        return "(" + str + ")";
    }   else    {
        return str;
    }
}

export function getAllReferanciables( tree: Attributes.Category, rootKey: string = "$root" ) : Record<string, Attributes.ReferentiableAttribute> {
    let ret: Record<string, Attributes.ReferentiableAttribute> = {};

    Object.keys(tree.attributes).forEach( key => {
        const attr = tree.attributes[key];
        if ([
            "number", "computed-number", 
            "enum"  , "computed-enum"
        ].includes(attr.type)) {
            ret[rootKey + "." + key] = attr as Attributes.ReferentiableAttribute;
        }   else if ( attr.type === "category" ){ 
            ret = {
                ...ret,
                ...getAllReferanciables(attr, rootKey + "." + key),
            }
        }
    } )

    return ret;
}