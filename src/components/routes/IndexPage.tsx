import * as React from "react";
import { Route } from "react-router";
import { Grid, Typography, Card, CardContent, Button, Divider } from "@material-ui/core";
import { history, goTo, PAGES } from "@/components/router/history";

export default class IndexPage extends Route {

    render() {
        return <Grid container alignItems="center" justify="center"> 
            <Grid item xs={12} style={{ marginBottom: "5%" }}>
                <Typography align="center" variant="headline">Role Playing Games Manager</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider/>
                <Card>
                    <CardContent>
                        <Typography variant="body1" align="center">
                            Select Mode:
                        </Typography>
                    </CardContent>
                    <Grid style={{ padding: "2%", paddingTop: 0 }} container justify="center">
                        <Button style={{ marginRight: "2%" }} variant="raised" color="primary" 
                                onClick={_ => goTo(PAGES.GAME_MASTER)}>
                            Game Master
                        </Button>
                        <Button style={{ marginLeft: "2%" }} variant="raised" color="secondary" 
                                onClick={_ =>goTo(PAGES.PLAYER)}>
                            Player
                        </Button>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    }

}
