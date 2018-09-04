export namespace Attributes {
    export interface Category {
        name: string;
        type: "category";
        attributes: Record<string, Attribute>;
    }
    export type ReferentiableAttribute = NumberAttribute | EnumAttribute | ComputedEnumAttribute | ComputedAttribute;
    export type Attribute = Category | NumberAttribute | EnumAttribute | ComputedEnumAttribute | ComputedAttribute | TextAttribute;
    export interface NumberAttribute {
        name: string;
        type: "number";
        min: number; max: number;
    }
    export interface EnumAttribute {
        name: string;
        type: "enum";
        enum: Record<string, number>;
    }
    export interface ComputedEnumAttribute {
        name: string;
        type: "computed-enum";
        formula: Formulas.Expression;
        enum: Record<number, number>;
    }
    export interface ComputedAttribute {
        name: string;
        type: "computed-number";
        formula: Formulas.Expression;
    }
    export interface TextAttribute {
        name: string;
        type: "text";
    }
}
export namespace Formulas {
    export enum Operation {
        ADDITION        = "+",
        SUBTRACTION     = "-",
        MULTIPLICATION  = "*",
        DIVISION        = "/",
        POWER           = "**",
        ROOT            = "//",  
        MAX             = "max",      
        MIN             = "min",      
    }
    export type FunctionalOperation = Operation.MAX | Operation.MIN;
    export interface Value {
        type: "value";
        value: number;
    }
    export interface RefValue {
        type: "ref-value";
        value: string;
    }
    export type Operands = Value | Expression | RefValue;
    export interface Expression {
        type: "exprs";
        operation: Operation;
        operands: Operands[];
    }
}
export namespace Tokens {
    export interface Char {
        value: string;
    }
    export interface Value {
        value: string;
        ref: string;
        type: "ref";
    }
    export interface Function {
        value: Formulas.FunctionalOperation;
        type: "func";
    }
    export type Token = Char | Value | Function;
}