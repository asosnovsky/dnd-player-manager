import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Grid, LinearProgress } from '@material-ui/core';
import CharacterSheetEditorContainer from '@/components/containers/CharacterSheetEditor';
import { CharacterSheet } from '@/states/CharacterSheets';
import { genDefaultTree } from '@/db/util';
import NavBar from '@/components/layouts/NavBar';

export interface IProps extends RouteComponentProps<{ id: string }> {

}
export interface IState {
    sheet?: CharacterSheet;
}
export default class CharacterSheetEditorPage extends React.Component<IProps, IState> {
    state:IState = { };
    
    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }
    async componentWillReceiveProps(nextProps: IProps) {
        this.setState({ sheet: undefined });
        NavBar.setCustomHeader(`Sheet/...`);

        const { params: { id } } = nextProps.match;
        let sheet:CharacterSheet;

        if ( id.toLocaleLowerCase() === "test" ) {
            sheet = new CharacterSheet({
                name: "Test",
                description: "Sample Tree",
                tree: genDefaultTree(),
                owner: null,
            });
        }   else     {
            sheet = await CharacterSheet.loadFromId(nextProps.match.params.id);
        }
        if (sheet) {
            this.setState({
                sheet
            });
            NavBar.setCustomHeader(`Sheet / ${sheet.name}`);
        }
    }
    render() {
        if (this.state.sheet) {
            return <Grid container justify="center" direction="column">
                <CharacterSheetEditorContainer sheet={this.state.sheet}/>
            </Grid>
        }   else    {
            return <LinearProgress/>
        }
    }
    
}
