import * as  React from "react";
import { Grid, Typography, Table, TableBody, TableRow, TableCell, TableHead, IconButton, Dialog } from '@material-ui/core';
import { observer } from 'mobx-react';
import { gameState } from '@/states';
import EditableText from '@/components/common/EditableText';

interface IState {
}
interface IProps {
}

@observer
export default class GameOverview extends React.Component<IProps, IState> {
    state = {};
    renderPlayers() {
        const ret:any[] = [];
        gameState.players.forEach( (player, key) => {
            ret.push(<TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{player.name}</TableCell>
            </TableRow>)    
        } )
        return ret;
    }
    render() {
        const isHost = gameState.isHost;
        return <Grid container justify="center">
            <Grid item xs={12} md={10}>
                <EditableText variant="" defaultValue={gameState.title} restrictEdit={!isHost} onSave={ v => {
                    gameState.title = v;
                    gameState.saveMeta();
                } }/>
            </Grid>
            <Grid item xs={12} md={10}>
                <EditableText defaultValue={gameState.host.name || "N/A"} restrictEdit={!isHost} onSave={ name => 
                    gameState.curretPlayer.update({ name }).save()
                }/>
            </Grid>
            <Grid item xs={12} md={10}>
                <Typography variant="display1">Players</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.renderPlayers()}
                    </TableBody>
                </Table>
            </Grid>

        </Grid>
    }
}


