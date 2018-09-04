import { Formulas, Attributes } from '@/attr-parser/typings';
export const OPERATIONS = Formulas.Operation;

export default class Evaluator {
    constructor(
        private tree: Attributes.Category
    ){}
    evaluateRef ( ref: Formulas.RefValue, data: any ) : number {
        const keys = ref.value.split('.');
        let def: Attributes.Attribute = this.tree;
        let val: any = data;
        for(let key of keys) {
            switch(def.type) {
                case "category":
                    def = def.attributes[key];
                    val = val[key];
                    break;
                default: throw Error("[1] Invalid Value-reference");
            }
        }
        switch(def.type) {
            case "computed-number": return this.evaluateFormula(def.formula, data);
            case "computed-enum": 
                const evalVal = this.evaluateFormula(def.formula, data);
                const nums = Object.keys(def.enum).map(Number).sort( (a,b) => a-b );
                for(let num of nums) {
                    if ( evalVal <= num ) {
                        return def.enum[num];
                    }
                }
                throw Error("[2] Invalid Enum-Value");
            case "enum": 
                if (val in def.enum) {
                    return def.enum[val];
                }
                throw Error("[2] Invalid Enum-Value");
            case "number": return val;
            default: throw Error("[2] Invalid Value-reference");
        }
    }
    evaluateFormula (exprs: Formulas.Expression, data: any = {}) : number {
        let startVal: number;
        if ( [
            Formulas.Operation.DIVISION,
            Formulas.Operation.MULTIPLICATION,
            Formulas.Operation.ROOT,
            Formulas.Operation.POWER,
        ].includes(exprs.operation) ) {
            startVal = 1;
        }   else if ( [
            Formulas.Operation.ADDITION,
            Formulas.Operation.SUBTRACTION,
        ].includes(exprs.operation) ) {
            startVal = 0;
        }   else    {
            throw new Error(`[1] Invalid Operation "${exprs.operation}"`);
        }
        return exprs.operands.reduce( (tot, val) => {
            let numericVal: number;
            if(val.type === "exprs") {
                numericVal = this.evaluateFormula(val, data);
            }   else  if(val.type === 'value')   {
                numericVal = Number(val.value);
            }   else  if(val.type === 'ref-value') {
                numericVal = this.evaluateRef(val, data);
            }
            switch(exprs.operation) {
                case Formulas.Operation.ADDITION    : return tot + numericVal;
                case Formulas.Operation.SUBTRACTION : return tot - numericVal;
                case Formulas.Operation.MULTIPLICATION : return tot * numericVal;
                case Formulas.Operation.DIVISION       : return tot / numericVal;
                case Formulas.Operation.POWER          : return tot ** numericVal;
                case Formulas.Operation.ROOT           : return tot ** (1/numericVal);
                default: throw new Error(`[2] Invalid Operation "${exprs.operation}"`);
            }
        }, startVal)
    }
    validate(data: any) {
        return this.__validate(data, this.tree);
    }
    __validate(data: any, tree: Attributes.Category, namespace: string = "$root") : string {
        let returnErrors = Object.keys( tree.attributes ).map( (key: string): string => {
            const attr = tree.attributes[key];
            if( key in data ) {
                switch (attr.type) {
                    case "number":
                        if ( typeof data[key] !== "number" ) {
                            return `- "${namespace}.${key}" should be a number!`;
                        }
                        if ( data[key] >  attr.max || data[key] < attr.min ) {
                            return `- "${namespace}.${key}" should be in [${attr.min},${attr.max}]!`;
                        }
                        break;
                    case "enum":
                        if ( !(data[key] in attr.enum) ) {
                            return `- "${namespace}.${key}" should be one of [${Object.keys(attr.enum).join(",")}]!`;
                        }
                        break;
                    case "text": break;
                    case "computed-number": break;
                    case "category": return this.__validate(data[key], attr, namespace + "." + key);
                    default:
                        return `- "${namespace}.${key}" has an invalid type!`;
                }
            }   else    {
                if ( attr.type !== "computed-number" ) {
                    return `- Missing "${namespace}.${key}"`;
                }
            }
            return null;
        }).reduce( (errs, err) => {
            return err !== null ? errs + "\n" + ` ${err}` : errs;
        } , "\n");
        return Object.keys(data).reduce( (errs, key) => {
            if (!(key in tree.attributes)) {
                return errs + `\n - Invalid "${namespace}.${key}"`;
            }
            return errs;
        }, returnErrors )
    }
}

