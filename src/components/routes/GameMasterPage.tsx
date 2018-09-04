import * as React from "react";
import { Route } from "react-router";
import { Grid, TextField, Button, Typography } from "@material-ui/core";
import { genGameId, gameState } from "@/states";
import { observer } from "mobx-react";
import { goTo, PAGES } from '@/components/router/history';

@observer
export default class GameMasterPage extends Route {

    render() {
        return <Grid container justify="center" alignContent="center" alignItems="center" direction="column">

            <Grid item>
                <TextField fullWidth label="Title" value={String(gameState.title || "")} onChange={ e =>
                    gameState.title = e.currentTarget.value
                } />
            </Grid>

            <Grid item>
                <Typography variant="headline">
                    {gameState.id}
                </Typography>
            </Grid>
            
            <Grid item>
                <Button variant="raised" color="primary" onClick={ async _ => {
                    await genGameId()
                    goTo(PAGES.GAME_OVERVIEW)
                }}>
                    Generate New Host ID
                </Button>
                {!!gameState.id && <Button variant="raised" color="secondary" onClick={_ => genGameId()}>
                    Save
                </Button>}
            </Grid>
        </Grid>
    }

}
