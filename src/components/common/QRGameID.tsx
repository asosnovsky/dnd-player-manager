import * as React from "react";
import { gameState } from '@/states';
import * as QRCode from 'qrcode.react';
import { Grid } from '@material-ui/core';

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