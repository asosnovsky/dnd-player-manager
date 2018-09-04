import * as React from "react";

import { state as sidebarstate } from "./SideBar";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Toolbar from "@material-ui/core/Toolbar";
import { Typography, DialogContent, DialogTitle } from "@material-ui/core";
import { state, PAGES, goTo } from "@/components/router/history";
import { observer } from "mobx-react";
import { computed, toJS } from "mobx";
import { gameState } from "@/states";
import EditableText from '@/components/common/EditableText';
import QRGameID from '@/components/common/QRGameID';
import LinkIcon from "@material-ui/icons/Adjust";

interface IState {
    showQR: boolean;
}

@observer
export default class extends React.Component<{},IState> {
    state = { showQR: false }
    @computed get title() {
        switch(state.currentPage) {
            case PAGES.HOME: return ""
            case PAGES.PLAYER: return "Player Mode"
            case PAGES.GAME_MASTER: return "GM Mode"
            case PAGES.GAME_OVERVIEW: return `Game Mode`
            default:
                return state.currentPage;
        }
    }
    render() {
        const playerName = gameState.curretPlayerName;
        const isGameOverviewPage = state.currentPage === PAGES.GAME_OVERVIEW;
        return <AppBar position="sticky" color="primary">
            <Toolbar>
                <Button color="inherit" onClick={_ => sidebarstate.isOpen = true}>☰</Button>
                <Typography color="inherit" variant="title">
                    {this.title}
                    {isGameOverviewPage && <Button onClick={() => {
                            this.setState({
                                showQR: !!gameState.id,
                            })
                    }}>QR Code <LinkIcon/></Button>}
                    <br/>
                    <EditableText defaultValue={playerName} onSave={s => {
                        gameState.updatePlayerName(s)
                    }} />
                </Typography>
            </Toolbar>
            {isGameOverviewPage && <Dialog open={this.state.showQR} onClose={_ => this.setState({showQR: false})}>
                <DialogTitle>{gameState.id}</DialogTitle>
                <DialogContent>
                    <QRGameID/>
                </DialogContent>
            </Dialog>}
        </AppBar>
    }
}

