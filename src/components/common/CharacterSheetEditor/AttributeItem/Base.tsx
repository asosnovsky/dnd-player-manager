import * as React from "react";
import { ListItem, ListItemText, ListItemIcon, TextField, Button } from '@material-ui/core';

import { AttributeProps } from '@/components/common/CharacterSheetEditor/AttributeItem/typings';
import EditableText from '@/components/common/EditableText';

export interface IProps extends AttributeProps<{ name: string; }> {
    icon: JSX.Element;
    content: JSX.Element;
    sibling?: JSX.Element;
};
export default class BaseAttributeItem extends React.Component<IProps> {
    render() {
        const { props: { id, attr, content, icon, sibling, onSave } } = this;
        
        const comp = <ListItem key={id + "_item"}>
            <ListItemIcon>{icon}</ListItemIcon>
            <EditableText defaultValue={attr.name} onSave={ name => {
                onSave(id, {
                    ...attr,
                    name,
                })
            } } />
            {content}
        </ListItem>

        if (sibling) {
            return [
                comp, sibling
            ]
        }else{
            return comp;
        }

    }
}