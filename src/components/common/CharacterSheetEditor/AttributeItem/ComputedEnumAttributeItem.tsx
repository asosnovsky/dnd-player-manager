import * as React from "react";
import { ListItem, ListItemText, ListItemIcon, Collapse, TextField, Button, Dialog, DialogTitle, DialogContent, Grid } from '@material-ui/core';

import EnumIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';

import { Attributes } from '@/attr-parser/typings';

import FormulaEditor from '@/components/common/FormulaEditor';
import EditableChip from '@/components/common/EditableChip';
import { AttributeProps } from '@/components/common/CharacterSheetEditor/AttributeItem/typings';
import { Expression } from '@/components/common/Formula';
import Notifier from '@/components/layouts/Notifier';

export default class ComputedEnumAttributeItem extends React.Component<AttributeProps<Attributes.ComputedEnumAttribute>, { newVal: string; enableEdit?: boolean; } > {
    state = { newVal: "", enableEdit: false };
    updateOrCreate = (s: string, oldName?: number) => {
        const {id, attr, onSave} = this.props;
        const enums = {
            ...attr.enum
        }
        if (oldName) {
            delete enums[oldName];
        }

        if (s.trim() === "") {
            return;
        }
        const sSplitted = s.split("=>")
        if (sSplitted.length !== 2) {
            Notifier.notify("Invalid Syntax!")
            return;
        }

        const [newName, val] = sSplitted;
        const numVal = Number(val);
        const numNewName = Number(newName.trim());

        if (isNaN(numNewName)) {
            Notifier.notify("Computed enums can only map number ranges!")
            return;
        }
        if (isNaN(numVal)) {
            Notifier.notify("Invalid mapping to. Must be numeric!")
            return;
        }

        const mapeds = Object.keys(enums).map(Number);
        const similarMapIdx = mapeds.map( k => enums[k] ).indexOf(numVal);
        if (similarMapIdx > -1) {
            delete enums[mapeds[similarMapIdx]];
        }

        return onSave(id, {
            ...attr,
            enum: {
                ...enums,
                [numNewName] : numVal,
            }
        })
    }
    render() {
        const { props: { id, attr, onSave, refs }, state: { newVal, enableEdit } } = this;
        return [
            <ListItem key={id + "_item"}>
                <ListItemIcon><EnumIcon/></ListItemIcon>
                <ListItemText inset primary={attr.name}/>
                <Button onClick={ () => this.setState({ enableEdit: true }) }>
                    <Expression expression={attr.formula} getRef={ s => refs.getRef(s) }/>
                    <EditIcon/>
                </Button>
                <Dialog onClose={ () => this.setState({ enableEdit: false })} open={enableEdit}>
                    <DialogTitle title={`Edit ${id}`}>Edit {attr.name} Formula</DialogTitle>
                    <DialogContent>
                        <Grid container>
                            <FormulaEditor refs={refs} formula={attr.formula} onSave={ newFromula => {
                                onSave(id, {
                                    ...attr,
                                    formula: newFromula,
                                })
                                this.setState({ enableEdit: false })
                            } }/>
                        </Grid>
                    </DialogContent>
                </Dialog>
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
                        defaultValue={`${name} => ${attr.enum[name as any]}`} 
                        onSave={ s => this.updateOrCreate(s, Number(name)) }
                    /> 
                )}
            </Collapse>
        ]
    }
}