import * as React from "react";
import { Grid, Button, Input, TextField } from '@material-ui/core';
import CharacterSheetEditor from "@/components/common/CharacterSheetEditor";
import { CharacterSheet } from '@/states/CharacterSheets';
import Notifier from '@/components/layouts/Notifier';

export interface IProps {
    sheet: CharacterSheet;
}
interface IState {
    name: string;
    description: string;
}
export default class CharacterSheetEditorContainer extends React.Component<IProps, IState> {
    state:IState = { name: "", description: "" };
    componentWillMount() {
        if (this.props.sheet) {
            this.componentWillReceiveProps(this.props)
        }
    }
    componentWillReceiveProps(nextProps:IProps) {
        this.setState({
            name: nextProps.sheet.name,
            description: nextProps.sheet.description,
        })
    }
    onSave = async () => {
        Notifier.notify("Saving...")
        await this.props.sheet.update({
            name: this.state.name,
            description: this.state.description,
        }).save();
        Notifier.notify("Saved!")
    }
    render() {
        return <Grid item>
            <Grid container justify="center">
            <TextField label="Sheet Name" value={this.state.name} onChange={ e => {
                    this.setState({
                        name: e.currentTarget.value,
                    })
                } } onKeyUp={ e => {
                    if (e.ctrlKey && e.shiftKey && e.key === "Enter") {
                        this.onSave()
                    }
                }}/>
                <TextField label="Sheet Description" value={this.state.description} onChange={ e => {
                    this.setState({
                        description: e.currentTarget.value,
                    })
                } } onKeyUp={ e => {
                    if (e.ctrlKey && e.shiftKey && e.key === "Enter") {
                        this.onSave()
                    }
                }} multiline/>
                <Button onClick={ this.onSave } variant="contained" color="primary">Save to Server</Button>
            </Grid>
            <Grid container justify="center" direction="column">
                <CharacterSheetEditor value={this.props.sheet.tree} onSave={newTree => {
                    this.props.sheet.update({
                        tree: newTree,
                    });                
                }}/>
            </Grid>
        </Grid>
    }
    
}
