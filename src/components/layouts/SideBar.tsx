import * as React from "react";
import {observable} from "mobx";
import {observer, inject} from "mobx-react";

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import {ListItem, ListItemIcon, IconButton} from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Person from "@material-ui/icons/Person";
import Home from "@material-ui/icons/Home";
import CreateNewFolder from "@material-ui/icons/CreateNewFolder";
import CharacterSheetIcon from "@material-ui/icons/People";
import {goHomeOrBack, history, PAGES, goTo} from "@/components/router/history";

export const state = observable({isOpen: false});

@observer
export default class extends React.Component {
    goTo = (path: PAGES, master: boolean = false) => {
        return () => {
            state.isOpen = false;
            if (path === PAGES.HOME && !master) {
                goHomeOrBack();
            }else{
                goTo(path)
            }
        }
    }
    render() {
        return <Drawer open={state.isOpen} onClose={_ => state.isOpen = false}>
            <List>
                {window.location.pathname !== PAGES.HOME && <ListItem>
                    <IconButton onClick={this.goTo(PAGES.HOME, true)}>
                        <ArrowBack/>
                    </IconButton>
                </ListItem>}
                <ListItem>
                    <IconButton onClick={this.goTo(PAGES.HOME)}>
                        <Home/>
                    </IconButton>
                </ListItem>
                <ListItem>
                    <IconButton onClick={this.goTo(PAGES.PLAYER)}>
                        <Person/>
                    </IconButton>
                </ListItem>
                <ListItem>
                    <IconButton onClick={this.goTo(PAGES.GAME_MASTER)}>
                        <CreateNewFolder/>
                    </IconButton>
                </ListItem>
                <ListItem>
                    <IconButton onClick={this.goTo(PAGES.CHARACTER_LSTING)}>
                        <CharacterSheetIcon/>
                    </IconButton>
                </ListItem>
            </List>
        </Drawer>
    }
}