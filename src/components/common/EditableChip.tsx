import * as React from "react";
import Chip from "@material-ui/core/Chip"
import { TextField, PropTypes } from '@material-ui/core';

interface IState {
    isEditable: boolean;
    value: string;
}
interface IProps {
    onSave: (s: string) => void;
    defaultValue: string;
    restrictEdit?: boolean;
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
            props: { restrictEdit },
            state: { value, isEditable }
         } = this;
        if (isEditable && !restrictEdit) {
            return <Chip label={<TextField value={value} onChange={e => this.onChange(e.target.value)} onDoubleClick={this.onSave} onKeyUp={ e => {
                if (e.key === 'Enter') {
                    this.onSave();
                }
            }} />}/>
        }   else    {
            return <Chip label={value} onClick={ e => {
                this.setState({
                    isEditable: true,
                })
            } }/>
        }
    }
}