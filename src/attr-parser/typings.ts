export namespace Attributes {
    export interface Category {
        name: string;
        type: "category";
        attributes: Record<string, Attribute>;
    }
    export type ReferentiableAttribute = { key: string; } & (NumberAttribute | EnumAttribute | ComputedEnumAttribute | ComputedAttribute);
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
    }
    export enum Functions {
        MAX             = "max",      
        MIN             = "min",      
    }
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
        operation: Operation | Functions;
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
        value: Formulas.Functions | "";
        type: "func";
    }
    export type Token = Char | Value | Function;
    export type NonChar = Value | Function;
}

export const OPERATION_PRIORITY:Record<Formulas.Expression["operation"], number> = {
    "+" : 0,
    "-" : 0,
    "*" : 2 ,
    "/" : 2,
    "**": 3,
    "//": 3,
    "min": 4,
    "max": 4,
}
export type OPEN_BRACE = "(" | "{" | "[";
export type CLOSE_BRACE = ")" | "}" | "]";
export const BRACES: Record<OPEN_BRACE, CLOSE_BRACE> = {
    "[": "]",    
    "(": ")",    
    "{": "}",    
}