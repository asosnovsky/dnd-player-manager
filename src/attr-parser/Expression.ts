import { Formulas, OPERATION_PRIORITY } from '@/attr-parser/typings';

export default class Expression implements Formulas.Expression {
    public type = "exprs" as "exprs";

    constructor(
        public operation: Formulas.Expression["operation"] = null,
        public operands: Formulas.Expression["operands"] = [],
        public parent?: Expression,
    ) {}
    
    makeChild(operation: Formulas.Expression["operation"]) {
        const child = new Expression(operation, [], this);
        this.operands.push(child);
        return child;
    }

    pushNum(value:number) {
        this.operands.push({
            type: "value",
            value,
        })
    }

    pushRef(value: string) {
        this.operands.push({
            type: "ref-value",
            value, 
        })
    }

    getParentThroughOperation(operation: Formulas.Operation): Expression {
        if ( this.operation === null ) {
            this.operation = operation;
            return this;
        }
        if ( this.operation !== operation ) {
            if ( OPERATION_PRIORITY[this.operation] <= OPERATION_PRIORITY[operation] ) {
                const child = this.makeChild(operation);
                      child.operands = this.operands.splice(this.operands.length - 2, 1);
                    return child;
            }   else    {
                if ( this.parent ) {
                    return this.parent.getParentThroughOperation(operation);
                }   else    {
                    const newChildWrapper = new Expression(this.operation, this.operands);
                    this.operands = [newChildWrapper];
                    this.operation = operation;
                    return this;
                }
            }
        }   else    {
            return this;
        }
    }

    toJSON = (): Formulas.Expression => ({
        operation: this.operation,
        operands: this.operands.map( operand => {
            if ( operand instanceof Expression ) {
                return operand.toJSON();
            }
            return operand;
        } ),
        type: this.type
    })

    toString = (): string => `{${this.operation}; ${this.operands.map( v => {
        if ( v.type === "value" ) return v.value;
        if ( v.type === "ref-value" ) return v.value;
        if ( v instanceof Expression ) return v.toString();
        if ( v.type === "exprs" ) return v.operands;
    } ).join(",")}}`
}