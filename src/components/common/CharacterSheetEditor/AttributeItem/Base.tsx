import * as React from "react";
import { ListItem, ListItemIcon, IconButton } from '@material-ui/core';

import DeleteIcon from "@material-ui/icons/Clear";

import { AttributeProps } from '@/components/common/CharacterSheetEditor/AttributeItem/typings';
import EditableText from '@/components/common/EditableText';

export interface IProps extends AttributeProps<{ name: string; }> {
    isRoot?: boolean;
    icon: JSX.Element;
    content: JSX.Element;
    sibling?: JSX.Element;
};
export default class BaseAttributeItem extends React.Component<IProps> {
    render() {
        const { props: { id, attr, content, icon, sibling, onSave, isRoot } } = this;
        
        let comp: JSX.Element;

        if (isRoot) {
            comp = <ListItem key={id + "_item"}>
                <EditableText defaultValue={attr.name} onSave={ name => {
                    onSave(id, {
                        ...attr,
                        name,
                    })
                } } />
                {content}
            </ListItem>
        }   else    {
            comp = <ListItem key={id + "_item"}>
                <ListItemIcon><IconButton style={{ color: "red" }} onClick={ () => { onSave(id, undefined) } }>
                    <DeleteIcon/>
                </IconButton></ListItemIcon>
                <ListItemIcon>{icon}</ListItemIcon>
                <EditableText defaultValue={attr.name} onSave={ name => {
                    onSave(id, {
                        ...attr,
                        name,
                    })
                } } />
                {content}
            </ListItem>
        }

        if (sibling) {
            return [
                comp, sibling
            ]
        }else{
            return comp;
        }

    }
}