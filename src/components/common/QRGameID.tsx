import * as React from "react";
import { gameState } from '@/states';
import QRCode from 'qrcode.react';
import { Grid, Typography } from '@material-ui/core';


export default () => <Grid container direction="column" justify="center">
    <Grid item>
        <QRCode value={gameState.id || "N/A"} style={{
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'block',
        }}/>
    </Grid>
</Grid>;