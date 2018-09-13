import * as React from "react";
import { Route } from "react-router";
import FormulaEditor from '@/components/common/FormulaEditor';
import Referenciables from '@/attr-parser/Referenciables';
import { OPERATIONS } from '@/attr-parser/evaluators';
import { Attributes } from '@/attr-parser/typings';

const demo:Attributes.Category = {
    name: "$root",
    type: "category",
    attributes: {
        test: {
            name: "Formula Test",
            type: "computed-number",
            formula: {
                type: "exprs",
                operation: OPERATIONS.ADDITION,
                operands: []
            }
        },
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
                        operands: [{ value: "$root.attr.exprs", type: "ref-value" }]
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
                                    { type: "ref-value", value: "$root.attr.str" },
                                ]
                            },
                            {
                                type: "exprs",
                                operation: OPERATIONS.MULTIPLICATION,
                                operands: [
                                    { type: "value", value: 5 },
                                    { type: "ref-value", value: "$root.attr.lvl" },
                                ]
                            },
                            {
                                type: "exprs",
                                operation: OPERATIONS.MULTIPLICATION,
                                operands: [
                                    { type: "value", value: 2 },
                                    { type: "ref-value", value: "$root.attr.race" },
                                ]
                            }
                        ]
                    }
                }
            }
        }
    }  
};
export default class ExamplePage extends Route {

    render() {
        return <div>
            <FormulaEditor formula={{
                        type: "exprs",
                        operation: OPERATIONS.ADDITION,
                        operands: [
                            
                        ]
                    }} refs={new Referenciables(demo)}/>
            {/* <div contentEditable ref={ e => console.log(e) } onKeyDown={e => console.log("k",e.target)}></div> */}
        </div>
    }

}
