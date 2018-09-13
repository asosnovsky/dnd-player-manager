import * as React from "react";
import { Grid, ListItem, ListItemText, ListItemIcon, Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core';

import ComputedIcon from '@material-ui/icons/Computer';
import EditIcon from '@material-ui/icons/Edit';

import FormulaEditor from '@/components/common/FormulaEditor';
import { Attributes } from '@/attr-parser/typings';
import { Expression } from '@/components/common/Formula';
import { AttributeProps } from '@/components/common/CharacterSheetEditor/AttributeItem/typings';
import BaseAttributeItem from '@/components/common/CharacterSheetEditor/AttributeItem/Base';

export default class ComputedNumberAttributeItem extends React.Component<AttributeProps<Attributes.ComputedAttribute>, { enableEdit: boolean }> {
    state = { enableEdit: false }
    render() {
        const { props, state: { enableEdit } } = this;
        return <BaseAttributeItem {...props}
            icon={<ComputedIcon/>}
            content={<ListItemText>
                <Button onClick={ () => this.setState({ enableEdit: true }) }>
                    <Expression expression={props.attr.formula} getRef={ s => props.refs.getRef(s) }/>
                    <EditIcon/>
                </Button>
                <Dialog onClose={ () => this.setState({ enableEdit: false })} open={enableEdit}>
                    <DialogTitle title={`Edit ${props.id}`}>Edit {props.attr.name} Formula</DialogTitle>
                    <DialogContent>
                        <Grid container>
                            <FormulaEditor refs={props.refs} formula={props.attr.formula} onSave={ newFromula => {
                                props.onSave(props.id, {
                                    ...props.attr,
                                    formula: newFromula,
                                })
                                this.setState({ enableEdit: false })
                            } }/>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </ListItemText>}
        />
    }
}
