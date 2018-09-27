import * as React from "react";
import { Router, Switch, Route } from "react-router";

import { history } from "./history";

import NavBar from "@/components/layouts/NavBar";
import ErrorBoundary from "@/components/layouts/ErrorBoundary";
import Notifier from '@/components/layouts/Notifier';
import SideBar from "@/components/layouts/SideBar";

import { PAGES } from "@/components/router/routes.enums";

import ExamplePage from "@/components/routes/ExamplePage";
import NotFoundPage from "@/components/routes/NotFoundPage";
import IndexPage from "@/components/routes/IndexPage";
import PlayerPage from "@/components/routes/game/PlayerPage";
import GameMasterPage from "@/components/routes/game/GameMasterPage";
import GameOverviewPage from "@/components/routes/game/GameOverviewPage";
import CharacterSheetListingPage from '@/components/routes/character-sheets/CharacterSheetListingPage';
import CharacterSheetEditorPage from '@/components/routes/character-sheets/CharacterSheetEditor';

export default class AppRouter extends React.Component {
    public render() {
        return (
            <ErrorBoundary>
                <NavBar />
                <SideBar/>
                <ErrorBoundary>
                    <div style={{ marginTop: "5%" }}>
                        <Router history={history}>
                            <Switch>
                                <IndexPage path={PAGES.HOME} exact/>
                                <PlayerPage path={PAGES.PLAYER} exact/>
                                <GameMasterPage path={PAGES.GAME_MASTER} exact/>
                                <GameOverviewPage path={PAGES.GAME_OVERVIEW} exact/>
                                <CharacterSheetListingPage path={PAGES.CHARACTER_LSTING} exact/>
                                <Route path={PAGES.CHARACTER_EDITOR + "/:id"} component={CharacterSheetEditorPage} exact/> 

                                <ExamplePage path={"/example"}/>
                                <NotFoundPage path="*"/>
                            </Switch>
                        </Router>
                    </div>
                </ErrorBoundary>
                <Notifier/>
            </ErrorBoundary>
        );
    }
}
