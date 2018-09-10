import { Formulas } from '@/attr-parser/typings';

export function isOperation(s: string) {
    return Object.values(Formulas.Operation).includes(s);
}

export function isFunction(s: string) {
    return Object.values(Formulas.Functions).includes(s);
}

export function isOpenBrace(s: string) {
    return ["(", "[", "{"].includes(s);
}

export function isCloseBrace(s: string) {
    return [")", "]", "}"].includes(s);
}

export function isBrace(s: string) {
    return isOpenBrace(s) || isCloseBrace(s);
}