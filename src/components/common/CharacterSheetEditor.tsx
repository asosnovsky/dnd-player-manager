import * as React from "react";
import { Grid, List, ListItem, ListItemText, Paper, ListItemIcon, Collapse, IconButton, Divider, TextField, Chip, Button, Typography, ListItemSecondaryAction, FormControl, InputLabel, Select, MenuItem, NativeSelect } from '@material-ui/core';

import { applyOperation } from 'fast-json-patch'


import CategoryIcon from "@material-ui/icons/Category";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NumberIcon from '@material-ui/icons/ConfirmationNumber';
import EnumIcon from '@material-ui/icons/Menu';
import ComputedIcon from '@material-ui/icons/Computer';
import ArrowIcon from '@material-ui/icons/ChevronRight';
import AddIcon from '@material-ui/icons/Add';

import { Attributes, Formulas } from '@/attr-parser/typings';
import EditableChip from '@/components/common/EditableChip';
import Expression from '@/components/common/Formula';
import { OPERATIONS } from '@/attr-parser/evaluators';
import { getAllReferanciables } from '@/attr-parser/convertor';
import FormulaEditor from '@/components/common/FormulaEditor';

interface IProps {
    value?: Attributes.Category;
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
                this.setState({
                    tree: applyOperation(this.state.tree, {
                        op: "replace",
                        path: id,
                        value: attr,
                    }).newDocument
                })                
            } } getRef={ path => {
                return refs[path];
            } }/>
        </Paper>
    }

}

interface AttributeProps<Attr> {
    id: string;
    attr: Attr;
    onSave: ( path: string, value: Attr ) => void;
    getRef: ( path: string ) => Attributes.ReferentiableAttribute;
}

function AttributeItem( props: AttributeProps<Attributes.Attribute> ) {
    switch (props.attr.type) {
        case "category"         : return <CategoryAttributeItem id={props.id} attr={props.attr} onSave={props.onSave} getRef={props.getRef}/>
        case "number"           : return <NumberAttributeItem id={props.id} attr={props.attr} onSave={props.onSave} getRef={props.getRef}/>
        case "enum"             : return <EnumAttributeItem id={props.id} attr={props.attr} onSave={props.onSave} getRef={props.getRef}/>
        case "computed-enum"    : return <ComputedEnumAttributeItem id={props.id} attr={props.attr} onSave={props.onSave} getRef={props.getRef}/>
        case "computed-number"  : return <ComputedNumberAttributeItem id={props.id} attr={props.attr} onSave={props.onSave} getRef={props.getRef}/>
        default: return <ListItem id={props.id}>
            <ListItemText inset primary={props.attr.name} secondary={props.attr.type}/>
        </ListItem>
    }
}
interface ICategoryAttributeItemState {
    isOpen: boolean;
    currentNew: Attributes.Attribute["type"] | "";
    currentNewValue: string;
}
class CategoryAttributeItem extends React.Component<AttributeProps<Attributes.Category>, ICategoryAttributeItemState> {
    state: ICategoryAttributeItemState = { isOpen: false, currentNew: "", currentNewValue: "" };
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
        const { props: { id, attr, onSave, getRef }, state: { isOpen, currentNew, currentNewValue }, menuOpts } = this;
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
                        <AttributeItem key={subid} id={id+"/attributes/"+subid} attr={attr.attributes[subid]} onSave={onSave} getRef={getRef}/>
                    )}
                </List>
            </Collapse>
        ]
    }
}

class NumberAttributeItem extends React.Component<AttributeProps<Attributes.NumberAttribute>, { min: number; max: number; }> {
    state = { min: this.props.attr.min, max: this.props.attr.max }
    componentWillReceiveProps(nextProps: AttributeProps<Attributes.NumberAttribute>) {
        this.setState({ min: nextProps.attr.min, max: nextProps.attr.max })
    }
    onSave = () => {
        this.props.onSave(this.props.id, {
            ...this.props.attr,
            min: Math.min(this.state.max, this.state.min),
            max: Math.max(this.state.max, this.state.min),
        })
    }
    onEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            this.onSave();
        }
    } 
    render() {
        const { props: { id, attr }, onSave, onEnter } = this;
        return <ListItem key={id + "_item"}>
            <ListItemIcon><NumberIcon/></ListItemIcon>
            <ListItemText inset primary={attr.name}/>
            <TextField type="number" value={this.state.min} onKeyUp={onEnter} onChange={ e => this.setState({ min: Number(e.target.value) })}/>
            <TextField type="number" value={this.state.max} onKeyUp={onEnter} onChange={ e => this.setState({ max: Number(e.target.value) })}/>
            <Button onClick={onSave}>Save</Button>
        </ListItem>
    }
}

class ComputedNumberAttributeItem extends React.Component<AttributeProps<Attributes.ComputedAttribute>, { formula: Formulas.Expression }> {
    state = { formula: this.props.attr.formula }
    componentWillReceiveProps(nextProps: AttributeProps<Attributes.ComputedAttribute>) {
        this.setState({ formula: nextProps.attr.formula })
    }
    onSave = () => {
        this.props.onSave(this.props.id, {
            ...this.props.attr,
            formula: this.state.formula,
        })
    }
    onEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            this.onSave();
        }
    } 
    render() {
        const { props: { id, attr, getRef }, state: { formula }, onSave, onEnter } = this;
        return <ListItem key={id + "_item"}>
            <ListItemIcon><ComputedIcon/></ListItemIcon>
            <ListItemText inset primary={attr.name}/>
            <FormulaEditor/>
            <Expression expression={formula} getRef={getRef}/>
            <Button onClick={onSave}>Save</Button>
        </ListItem>
    }
}

class EnumAttributeItem extends React.Component<AttributeProps<Attributes.EnumAttribute>, { newVal: string } > {
    state = { newVal: "" };
    updateOrCreate = (s: string, oldName?: string) => {
        const {id, attr, onSave} = this.props;
        const enums = {
            ...attr.enum
        }
        if (oldName) {
            delete enums[oldName];
        }

        if (s.trim() === "") {
            return onSave(id, {
                ...attr,
                enum: enums,
            })
        }
        const [newName, val] = s.split("=>")
        const numVal = Number(val);

        if (isNaN(numVal)) {
            return onSave(id, {
                ...attr,
            })
        }

        const mapeds = Object.keys(enums);
        const similarMapIdx = mapeds.map( k => enums[k] ).indexOf(numVal);
        if (similarMapIdx > -1) {
            delete enums[mapeds[similarMapIdx]];
        }

        return onSave(id, {
            ...attr,
            enum: {
                ...enums,
                [newName.trim()] : numVal,
            }
        })
    }
    render() {
        const { props: { id, attr }, state: { newVal } } = this;
        return [
            <ListItem key={id + "_item"}>
                <ListItemIcon><EnumIcon/></ListItemIcon>
                <ListItemText inset primary={attr.name}/>
                <TextField placeholder="{Name} => {Number}" value={newVal} onChange={ e => this.setState({ newVal: e.currentTarget.value }) } onKeyUp={ e => {
                    if (e.key === "Enter") {
                        this.updateOrCreate(newVal);
                        this.setState({ newVal: "" });
                    }
                } }/>
            </ListItem>,
            <Collapse key={id + "_enum_vals"} in={Object.keys(attr.enum).length > 0} style={{marginLeft: "10%"}}>
                {Object.keys(attr.enum).map( name => 
                    <EditableChip 
                        key={name} 
                        defaultValue={`${name} => ${attr.enum[name]}`} 
                        onSave={ s => this.updateOrCreate(s, name) }
                    /> 
                )}
            </Collapse>
        ]
    }
}

class ComputedEnumAttributeItem extends React.Component<AttributeProps<Attributes.ComputedEnumAttribute>> {
    render() {
        const { props: { id, attr, onSave, getRef } } = this;
        return <ListItem key={id + "_item"}>
            <ListItemIcon><ComputedIcon/></ListItemIcon>
            <ListItemText inset primary={attr.name}/>
            <Expression expression={attr.formula} getRef={getRef}/>
            {Object.keys(attr.enum).map( name => <EditableChip key={name} defaultValue={`${name} => ${attr.enum[Number(name)]}`} onSave={ s => 
                {
                    const [newName, val] = s.split("=>")
                    const numVal = Number(val);
                    if (isNaN(numVal)) {
                        return onSave(id, {
                            ...attr,
                        })
                    }

                    const enums = {
                        ...attr.enum
                    }

                    delete enums[Number(name)];

                    return onSave(id, {
                        ...attr,
                        enum: {
                            ...enums,
                            [newName.trim()] : numVal,
                        }
                    })
                }
            }/> )}
        </ListItem>
    }
}
