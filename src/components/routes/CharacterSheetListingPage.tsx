import * as React from "react";
import { Route } from "react-router";
import { Grid, Button } from '@material-ui/core';
import CharacterSheetListingContainer from '@/components/containers/CharacterSheetListing';
import { goTo, PAGES } from '@/components/router/history';
import { CharacterSheet } from '@/states/CharacterSheets';
import { auth } from '@/db/app';
import { genDefaultTree } from '@/db/util';

export interface IState {
}
export default class CharacterSheetListingPage extends Route {
    createNewSheet = async () => {
        const sheet = new CharacterSheet({
            owner: auth.currentUser.uid,
            name: "New Sheet",
            description: "",
            tree: genDefaultTree(),
        })
        goTo(PAGES.CHARACTER_EDITOR, sheet.id);
    }
    render() {
        return <Grid container justify="center" direction="column">
            <Button onClick={this.createNewSheet}>Create New</Button>
            <CharacterSheetListingContainer onLoad={ cs => {
                goTo(PAGES.CHARACTER_EDITOR, cs.id)
            } }/>
        </Grid>
    }
    
}
