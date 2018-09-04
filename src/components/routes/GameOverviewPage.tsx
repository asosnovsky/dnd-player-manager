import * as React from "react";
import { Route } from "react-router";
import GameOverview from '@/components/containers/GameOverview';
import { gameState } from '@/states';
import { goTo, PAGES } from '@/components/router/history';
import { CircularProgress } from '@material-ui/core';

let timeout: any;
export default class GameOverviewPage extends Route {

    render() {
        if (timeout) window.clearTimeout(timeout)
        if (gameState.id) {
            return <GameOverview/>;
        }   else    {
            timeout = window.setTimeout(() => {
                goTo(PAGES.HOME)
            }, 1000)
            return <div>
                <CircularProgress/>
            </div>
        }
    }

}
