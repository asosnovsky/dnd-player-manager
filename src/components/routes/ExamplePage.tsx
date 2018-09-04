import * as React from "react";
import { Route } from "react-router";
import FormulaEditor from '@/components/common/FormulaEditor';

export default class ExamplePage extends Route {

    render() {
        return <div>
            <FormulaEditor/>
            {/* <div contentEditable ref={ e => console.log(e) } onKeyDown={e => console.log("k",e.target)}></div> */}
        </div>
    }

}
