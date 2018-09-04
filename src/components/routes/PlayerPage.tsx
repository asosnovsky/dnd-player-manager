import * as React from "react";
import { Route } from "react-router";
import { Grid, TextField } from "@material-ui/core";
import { joinGame } from "@/states";
import { goTo, PAGES } from '@/components/router/history';

export default class PlayerPage extends Route {

    render() {
        return <GameHostSearch/>
    }

}

class GameHostSearch extends React.Component<{}, {text: string}> {
    state = { text: ""};
    render() {
        return <Grid container justify="center">
            <Grid item component="form" xs={8} onSubmit={ async e => {
                e.preventDefault();
                await joinGame(this.state.text);
                goTo(PAGES.GAME_OVERVIEW)
            } }>
                <TextField label="Game Host ID" fullWidth value={this.state.text} onChange={ e => 
                    this.setState({
                        text: e.currentTarget.value,
                    })
                }/>
            </Grid>
        </Grid>
    }
}