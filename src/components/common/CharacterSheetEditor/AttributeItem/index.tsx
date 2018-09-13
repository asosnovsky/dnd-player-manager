import * as React from "react";
import {  List, ListItem, ListItemText, ListItemIcon, Collapse, IconButton, Divider, TextField, ListItemSecondaryAction, FormControl, NativeSelect } from '@material-ui/core';

import CategoryIcon from "@material-ui/icons/Category";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';

import { Attributes } from '@/attr-parser/typings';
import { OPERATIONS } from '@/attr-parser/evaluators';

import { ICategoryAttributeItemState, AttributeProps } from '@/components/common/CharacterSheetEditor/AttributeItem/typings';

import NumberAttributeItem from '@/components/common/CharacterSheetEditor/AttributeItem/NumberAttributeItem';
import EnumAttributeItem from '@/components/common/CharacterSheetEditor/AttributeItem/EnumAttributeItem';
import ComputedEnumAttributeItem from '@/components/common/CharacterSheetEditor/AttributeItem/ComputedEnumAttributeItem';
import ComputedNumberAttributeItem from '@/components/common/CharacterSheetEditor/AttributeItem/ComputedNumberAttributeItem';

function AttributeItem( props: AttributeProps<Attributes.Attribute> ) {
    switch (props.attr.type) {
        case "category"         : return <CategoryAttributeItem id={props.id} attr={props.attr} onSave={props.onSave} refs={props.refs}/>
        case "number"           : return <NumberAttributeItem id={props.id} attr={props.attr} onSave={props.onSave} refs={props.refs}/>
        case "enum"             : return <EnumAttributeItem id={props.id} attr={props.attr} onSave={props.onSave} refs={props.refs}/>
        case "computed-enum"    : return <ComputedEnumAttributeItem id={props.id} attr={props.attr} onSave={props.onSave} refs={props.refs}/>
        case "computed-number"  : return <ComputedNumberAttributeItem id={props.id} attr={props.attr} onSave={props.onSave} refs={props.refs}/>
        default: return <ListItem id={props.id}>
            <ListItemText inset primary={props.attr.name} secondary={props.attr.type}/>
        </ListItem>
    }
}

export default class CategoryAttributeItem extends React.Component<AttributeProps<Attributes.Category>, ICategoryAttributeItemState> {
    state: ICategoryAttributeItemState = { isOpen: true, currentNew: "", currentNewValue: "" };
    menuOpts: Array<{key: Attributes.Attribute["type"], name: string}> = [
        {key: "text", name: "Text" },
        {key: "number", name: "Number" },
        {key: "enum", name: "Mapping" },
        {key: "computed-number", name: "Computed Number" },
        {key: "computed-enum", name: "Computed Mapping" },
        {key: "category", name: "Category" },
    ];
    genNewAttrs(): Record<string, Attributes.Attribute> {
        let name = this.state.currentNewValue.trim();
        let id = name.toLowerCase().split(" ").join("_");
        if ( id === "" ) {
            id = Math.random().toString(36).substr(2, 5) + Date.now();
        }
        if ( id in this.props.attr.attributes ) {
            id += "_2";
        }
        switch (this.state.currentNew) {
            case "category": return {
                [id]: { name, type: this.state.currentNew, attributes: {} }
            }
            case "number": return {
                [id]: { name, type: this.state.currentNew, min: 0, max: 10 }
            }
            case "computed-number": return {
                [id]: { name, type: this.state.currentNew, formula: {
                    type: "exprs",
                    operation: OPERATIONS.ADDITION,
                    operands: [],
                } }
            }
            case "computed-enum": return {
                [id]: { name, type: this.state.currentNew, formula: {
                    type: "exprs",
                    operation: OPERATIONS.ADDITION,
                    operands: [],
                }, enum: {} }
            }
            case "enum": return {
                [id]: { name, type: this.state.currentNew, enum: {} }
            }
            case "text": return {
                [id]: { name, type: this.state.currentNew }
            }
            default: return {}
        }
    }
    render() {
        const { props: { id, attr, onSave, refs }, state: { isOpen, currentNew, currentNewValue }, menuOpts } = this;
        return [
            <ListItem key={id + "_item"}>
                <ListItemIcon><CategoryIcon/></ListItemIcon>
                <ListItemText inset primary={attr.name}/>
                <ListItemSecondaryAction>
                    <form onSubmit={ e => {
                        e.preventDefault();
                        this.setState({ isOpen: true })
                        onSave(id, {
                            ...attr, attributes: {
                                ...attr.attributes,
                                ...this.genNewAttrs(),
                            }
                        });
                    }}>
                        <FormControl>
                            <NativeSelect value={currentNew} onChange={ e => this.setState({ currentNew: e.currentTarget.value as any }) } >
                                <option value="">
                                    None
                                </option>
                                {menuOpts.map( ({ key, name }) => <option key={key} value={key}>
                                    {name}
                                </option> )}
                            </NativeSelect>
                            <span> </span>
                        </FormControl>
                        <TextField
                            label="Name"
                            disabled={currentNew === ""}
                            value={currentNewValue} onChange={e => this.setState({
                                currentNewValue: e.currentTarget.value,
                            })}
                        />
                        <IconButton disabled={currentNew === ""} type="submit">
                            <AddIcon/>
                        </IconButton>
                        <IconButton onClick={ _ => this.setState({ isOpen: !isOpen }) }>
                            {isOpen ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                        </IconButton>
                    </form>
                </ListItemSecondaryAction>
            </ListItem>,
            <Collapse key={id + "_sublist"} in={isOpen} style={{ marginLeft: "2%" }}>
                <Divider/>
                <List component="div" disablePadding>
                    {Object.keys(attr.attributes).map( subid => 
                        <AttributeItem key={subid} id={id+"/attributes/"+subid} attr={attr.attributes[subid]} onSave={onSave} refs={refs}/>
                    )}
                </List>
            </Collapse>
        ]
    }
}

