import Evaluator, { OPERATIONS } from "@/attr-parser/evaluators";

import { expect } from "chai";

const evaluator = new Evaluator({
    name: "$root",
    type: "category",
    attributes: {
        attr: {
            name: "Attributes",
            type: "category",
            attributes: {
                exprs: {
                    name: "Experience",
                    type: "number",
                    min: 0, max: Number.MAX_SAFE_INTEGER,
                },
                lvl: {
                    name: "Level",
                    type: "computed-enum",
                    formula: {
                        type: "exprs",
                        operation: OPERATIONS.ADDITION,
                        operands: [{ value: "attr.exprs", type: "ref-value" }]
                    },
                    enum: {
                        0: 1,
                        300: 2,
                        900: 3,
                        2700: 4,
                        6500: 5,
                        14000: 6,
                        23000: 7,
                    }
                },
                str: {
                    name: "Strength",
                    type: "number",
                    min: 0, max: 10,
                },
                race: {
                    name: "Race",
                    type: "enum",
                    enum: {
                        "Human": 0,
                        "Elf": 1
                    }
                },
                hp: {
                    name: "Health",
                    type: "computed-number",
                    formula: {
                        type: "exprs",
                        operation: OPERATIONS.ADDITION,
                        operands: [
                            { type: "value", value: 50 },
                            {
                                type: "exprs",
                                operation: OPERATIONS.MULTIPLICATION,
                                operands: [
                                    { type: "value", value: 5 },
                                    { type: "ref-value", value: "attr.str" },
                                ]
                            },
                            {
                                type: "exprs",
                                operation: OPERATIONS.MULTIPLICATION,
                                operands: [
                                    { type: "value", value: 5 },
                                    { type: "ref-value", value: "attr.lvl" },
                                ]
                            },
                            {
                                type: "exprs",
                                operation: OPERATIONS.MULTIPLICATION,
                                operands: [
                                    { type: "value", value: 2 },
                                    { type: "ref-value", value: "attr.race" },
                                ]
                            }
                        ]
                    }
                }
            }
        }
    }  
})

describe("Formula Evaluation",  () => {
    it("should equal 2", () => {
        expect(evaluator.evaluateFormula({
            type: "exprs",
            operation: OPERATIONS.ADDITION,
            operands: [
                { type: "value", value: 1 },
                { type: "value", value: 1 },
            ]
        })).equal(2)
    })
    it("should equal 1.5", () => {
        expect(evaluator.evaluateFormula({
            type: "exprs",
            operation: OPERATIONS.ADDITION,
            operands: [
                { type: "value", value: 1 },
                { type: "exprs", operation: OPERATIONS.DIVISION, operands: [
                    { type: "value", value: 2 },
                    { type: "exprs", operation: OPERATIONS.POWER, operands: [
                        { type: "value", value: 2 },
                        { type: "value", value: 2 },
                    ] },
                ] },
            ]
        })).equal(1.5)
    })
})
describe("Formula Evaluation with Data",  () => {
    it("should equal 6", () => {
        expect(evaluator.evaluateFormula({
            type: "exprs",
            operation: OPERATIONS.ADDITION,
            operands: [
                { type: "value", value: 1 },
                { type: "ref-value", value: "attr.str" },
            ]
        }, { attr: {
            str: 5
        } })).equal(6)
    })
    it("should equal 86", () => {
        expect(evaluator.evaluateFormula({
            type: "exprs",
            operation: OPERATIONS.ADDITION,
            operands: [
                { type: "value", value: 1 },
                { type: "ref-value", value: "attr.hp" },
            ]
        }, { attr: {
            str: 5,
            exprs: 300,
            race: "Elf"
        } })).equal( 1 + (50 + 5*5 + 2*5 + 2*1) )
    })
})
describe("Data Validation",  () => {
    it("checking out of boundary", () => {
        expect(
            evaluator.validate({
                attr: {
                    str: 51,
                    lvl: 5,
                } 
            })
        ).contain('"$root.attr.str" should be in [0,10]')
    })
    it("checking not in schema", () => {
        expect(
            evaluator.validate({
                attr: {
                    str: 1,
                    lvl: 5,
                    bar: 2
                } 
            })
        ).contain('Invalid "$root.attr.bar"')
    })
    it("checking missing", () => {
        expect(
            evaluator.validate({
                attr: {
                    str: 1,
                } 
            })
        ).contain('Missing "$root.attr.lvl"')
    })
})


