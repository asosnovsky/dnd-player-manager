import * as React from "react";
import {  
    Paper, 
} from '@material-ui/core';

import { applyOperation } from 'fast-json-patch'


import { Attributes, Formulas } from '@/attr-parser/typings';
import { getAllReferanciables } from '@/attr-parser/convertor';
import CategoryAttributeItem from '@/components/common/CharacterSheetEditor/AttributeItem';

interface IProps {
    value?: Attributes.Category;
    onSave?: ( newTree: Attributes.Category ) => void;
}
interface IState {
    tree: Attributes.Category;
}
export default class CharacterSheetEditor extends React.Component<IProps, IState> {

    state = { tree: this.props.value || { 
        name: "$root",
        type: "category",
        attributes: {},
    } }

    componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            tree: this.props.value || { 
                name: "$root",
                type: "category",
                attributes: {},
            }
        })
    }


    render() {
        const refs = getAllReferanciables(this.state.tree);
        return <Paper>
            <CategoryAttributeItem id="" attr={this.state.tree} onSave={ (id, attr) => {

                let newTree: Attributes.Category;
                if (!attr) {
                    newTree = applyOperation(this.state.tree, {
                        op: "remove",
                        path: id,
                    }).newDocument;
                }   else    {
                    newTree = applyOperation(this.state.tree, {
                        op: "replace",
                        path: id,
                        value: attr,
                    }).newDocument;
                }

                this.setState({
                    tree: newTree,
                })                
                if (this.props.onSave) {
                    this.props.onSave(newTree);
                }
            } } refs={refs}/>
        </Paper>
    }

}

