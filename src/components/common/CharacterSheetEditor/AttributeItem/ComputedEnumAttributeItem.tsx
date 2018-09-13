import * as React from "react";
import { Grid, ListItem, ListItemText, ListItemIcon, 
    Button, 
    Dialog, DialogContent, DialogTitle } from '@material-ui/core';

import ComputedIcon from '@material-ui/icons/Computer';
import EditIcon from '@material-ui/icons/Edit';

import { Attributes, Formulas } from '@/attr-parser/typings';
import EditableChip from '@/components/common/EditableChip';
import FormulaEditor from '@/components/common/FormulaEditor';
import { Expression } from '@/components/common/Formula';
import { AttributeProps } from '@/components/common/CharacterSheetEditor/AttributeItem/typings';

export default class ComputedEnumAttributeItem extends React.Component<AttributeProps<Attributes.ComputedEnumAttribute>, { enableEdit?: boolean }> {
    state = { enableEdit: false };
    render() {
        const { props: { id, attr, onSave, refs }, state: { enableEdit } } = this;
        return <ListItem key={id + "_item"}>
            <ListItemIcon><ComputedIcon/></ListItemIcon>
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