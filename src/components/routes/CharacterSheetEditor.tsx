import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Grid, LinearProgress } from '@material-ui/core';
import CharacterSheetEditorContainer from '@/components/containers/CharacterSheetEditor';
import { CharacterSheet } from '@/states/CharacterSheets';
import { genDefaultTree } from '@/db/util';

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
        this.setState({ sheet: undefined })
        const { params: { id } } = nextProps.match;
        if ( id.toLocaleLowerCase() === "test" ) {
            this.setState({
                sheet: new CharacterSheet({
                    name: "Test",
                    description: "Sample Tree",
                    tree: genDefaultTree(),
                    owner: null,
                })
            })
        }   else     {
            this.setState({
                sheet: await CharacterSheet.loadFromId(nextProps.match.params.id),
            });
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
