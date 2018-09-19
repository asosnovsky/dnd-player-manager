import { Attributes } from '@/attr-parser/typings';
import { OPERATIONS } from '@/attr-parser/evaluators';

export const genDefaultTree = () : Attributes.Category => ({
    type: "category",
    name: "Character Sheet",
    attributes: {
        about: { 
            type: "category",
            name: "About",
            attributes: {
                fname: {
                    type: "text",
                    name: "First Name"
                },
                lname: {
                    type: "text",
                    name: "Last Name"
                },
                race: {
                    name: "Race",
                    type: "enum",
                    enum: {
                        "Orc": 0,
                        "Human": 1,
                        "Elf": 2,
                    }
                },
                exp: {
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
                        operands: [{ value: "$root.about.exp", type: "ref-value" }]
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
                align: {
                    name: "Alignment",
                    type: "enum",
                    enum: {
                        "Chaotic": 0,
                        "Neutral": 1,
                        "Good": 2,
                    }
                }
            }
        },
        attr: {
            name: "Attributes",
            type: "category",
            attributes: {
                str: {
                    name: "Strength",
                    type: "number",
                    min: 0, max: 20,
                },
                dex: {
                    name: "Dexterity",
                    type: "number",
                    min: 0, max: 20,
                },
                con: {
                    name: "Constitution",
                    type: "number",
                    min: 0, max: 20,
                },
                int: {
                    name: "Intelligence",
                    type: "number",
                    min: 0, max: 20,
                },
                wis: {
                    name: "Wisdom",
                    type: "number",
                    min: 0, max: 20,
                },
                char: {
                    name: "Charisma",
                    type: "number",
                    min: 0, max: 20,
                }
            }
        },

    },
})