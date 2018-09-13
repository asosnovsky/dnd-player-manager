import * as React from "react";
import { ListItem, ListItemText, ListItemIcon, TextField, Button } from '@material-ui/core';

import NumberIcon from '@material-ui/icons/ConfirmationNumber';

import { Attributes, Formulas } from '@/attr-parser/typings';
import { AttributeProps } from '@/components/common/CharacterSheetEditor/AttributeItem/typings';

export default class NumberAttributeItem extends React.Component<AttributeProps<Attributes.NumberAttribute>, { min: number; max: number; }> {
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