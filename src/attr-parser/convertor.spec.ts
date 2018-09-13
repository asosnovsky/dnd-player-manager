import { convertTokensToAST, stringifyFormula } from "./convertor";
import { expect } from "chai";
import { FUNCTIONS } from '@/attr-parser/evaluators';

describe("AST Design", () => {
    it("Same Level", () => {
        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: "+" },
            { value: "1" },
        ]))).equals("1+1")

        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: "+" },
            { value: "1" },
            { value: "-" },
            { value: "2" },
        ]))).equals("1+(1-2)")

        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: "+" },
            { value: "1" },
            { value: "+" },
            { value: "1" },
            { value: "-" },
            { value: "2" },
        ]))).equals("1+1+(1-2)")
    })
    it("Top Level", () => {
        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: "+" },
            { value: "1" },
            { value: "/" },
            { value: "2" },
        ]))).equals("1+(1/2)")

        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: "+" },
            { value: "1" },
            { value: "-" },
            { value: "1" },
            { value: "/" },
            { value: "2" },
        ]))).equals("1+(1-(1/2))")

        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: "*" },
            { value: "2" },
            { value: "-" },
            { value: "1" },
            { value: "/" },
            { value: "2" },
        ]))).equals("(1*2)-(1/2)")

        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: "+" },
            { value: "2" },
            { value: "*" },
            { value: "1" },
            { value: "/" },
            { value: "2" },
            { value: "+" },
            { value: "3" },
        ]))).equals("1+(2*(1/2))+3")

        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: "+" },
            { value: "2" },
            { value: "*" },
            { value: "1" },
            { value: "/" },
            { value: "2" },
            { value: "*" },
            { value: "3" },
            { value: "+" },
            { value: "2" },
            { value: "-" },
            { value: "2" },
        ]))).equals("1+(2*(1/(2*3)))+(2-2)")
    })

    it("Empties", () => {
        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: " " },
            { value: "+" },
            { value: " " },
            { value: "2" },
            { value: "*" },
            { value: "1" },
            { value: " " },
            { value: "/" },
            { value: "2" },
            { value: "*" },
            { value: "3" },
            { value: " " },
            { value: "+" },
            { value: "2" },
            { value: " " },
            { value: "-" },
            { value: "2" },
        ]))).equals("1+(2*(1/(2*3)))+(2-2)")
    })

    it("Braces", () => {
        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: " " },
            { value: "+" },
            { value: " " },
            { value: "2" },
            { value: "*" },
            { value: "1" },
            { value: " " },
            { value: "/" },
            { value: "2" },
            { value: "*" },
            { value: "(" },
            { value: "3" },
            { value: " " },
            { value: "+" },
            { value: "2" },
            { value: " " },
            { value: "-" },
            { value: "2" },
            { value: ")" },
        ]))).equals("1+(2*(1/(2*(3+(2-2)))))")
    })
    it("Referances", () => {
        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: " " },
            { value: "+" },
            { ref: "$root.Level", value: "Level", type: "ref" },
        ]))).equals("1+$root.Level")
        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: " " },
            { value: "+" },
            { value: " " },
            { ref: "$root.Level", value: "Level", type: "ref" },
            { value: " " },
            { value: "**" },
            { value: "(" },
            { value: "10" },
            { value: "" },
            { value: "-" },
            { value: "" },
            { value: "2" },
            { value: "*" },
            { ref: "$root.Experience", type: "ref", value: "Experience" },
            { value: "" },
            { value: ")" },
        ]))).equals("1+($root.Level**(10-(2*$root.Experience)))")
    })
    it("Functions", () => {
        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: " " },
            { value: "+" },
            { type: "func", value: FUNCTIONS.MAX },
            { value: "2" },
            { value: "," },
            { value: "3" },
            { value: ")" },
        ]))).equals("1+(max(2,3))")
        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: " " },
            { value: "+" },
            { value: "3" },
            { value: "**" },
            { type: "func", value: FUNCTIONS.MIN },
            { type: "ref", value: "Level", ref: "$root.Level" },
            { value: "," },
            { value: "3" },
            { value: ")" },
        ]))).equals("1+(3**(min($root.Level,3)))")
    })
    it("Multichar-nums", () => {
        expect(stringifyFormula(convertTokensToAST([
            { value: "1" },
            { value: "0" },
            { value: "0" },
            { value: "+" },
            { type: "func", value: FUNCTIONS.MAX },
            { type: "ref", value: "Level", ref: "$root.Level" },
            { value: "," },
            { value: "2" },
            { value: "" },
            { value: "3" },
            { value: ")" },
        ]))).equals("100+(max($root.Level,23))")
    })
})
