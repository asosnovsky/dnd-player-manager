import * as React from "react";
import { ListItem, ListItemText, ListItemIcon, Collapse, TextField } from '@material-ui/core';

import EnumIcon from '@material-ui/icons/Menu';

import { Attributes, Formulas } from '@/attr-parser/typings';
import EditableChip from '@/components/common/EditableChip';
import { AttributeProps } from '@/components/common/CharacterSheetEditor/AttributeItem/typings';

export default class EnumAttributeItem extends React.Component<AttributeProps<Attributes.EnumAttribute>, { newVal: string } > {
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