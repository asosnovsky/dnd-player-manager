import * as React from "react";
import Typography from "@material-ui/core/Typography"
import { Style as TypographyVariants } from "@material-ui/core/styles/createTypography";
import { TextField, PropTypes } from '@material-ui/core';

interface IState {
    isEditable: boolean;
    value: string;
}
interface IProps {
    onSave: (s: string) => void;
    defaultValue: string;
    restrictEdit?: boolean;
    align?: PropTypes.Alignment;
    color?: PropTypes.Color | 'textPrimary' | 'textSecondary' | 'error';
    gutterBottom?: boolean;
    noWrap?: boolean;
    paragraph?: boolean;
    variant?: TypographyVariants;
}
export default class extends React.Component<IProps, IState> {
    state = { isEditable: false, value: "" };
    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }
    componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            isEditable: false,
            value: nextProps.defaultValue
        })
    }
    onSave = () => {
        this.setState({
            isEditable: false,
        })
        this.props.onSave(this.state.value)
    }
    onChange = (value: string) => this.setState({ value })
    render() {
        const {
            props: { onSave, defaultValue, restrictEdit, ...typoProps },
            state: { value, isEditable }
         } = this;
        if (isEditable && !restrictEdit) {
            return <TextField value={value} onChange={e => this.onChange(e.target.value)} onDoubleClick={this.onSave} onKeyUp={ e => {
                if (e.key === 'Enter') {
                    this.onSave();
                }
            }} />
        }   else    {
            return <Typography {...typoProps} variant="button" onClick={ e => {
                this.setState({
                    isEditable: true,
                })
            } }>{value}</Typography>
        }
    }
}