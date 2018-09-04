import * as React from "react";
import {Route} from "react-router";
import ArrowBack from "@material-ui/icons/ArrowBack";
import {goHomeOrBack} from "@/components/router/history";
import {
    Grid,
    Button,
    Typography
} from "@material-ui/core";


export default class NotFoundPage extends Route {
    public render() {
        return <Grid container justify="center" spacing={16}>
            <Grid item xs={8}>
                <Typography variant="headline">404 Not Found</Typography>
            </Grid>
            <Grid item xs={8}>
                <Button onClick={goHomeOrBack}>
                    <ArrowBack/>
                    Go Back
                </Button>
            </Grid>
        </Grid>;
    }
}
