import { database } from 'firebase';

import GameMaster from "@/states/Players/GameMaster";
import Player from "@/states/Players/Player";
import { gameState } from "./GameState";
import { games } from "@/db";
import Notifier from '@/components/layouts/Notifier';
import { goHomeOrBack } from '@/components/router/history';

export function __updateFromRef(ref: database.Reference) {
    let first = true;
    return new Promise( res => {
        ref.off('value');
        ref.on('value', snap => {
            const val = snap.val();
            if (!val) {
                Notifier.notify("Could not find game.");
                gameState.reset();
                goHomeOrBack();
                return;
            }
            const players = val.players || {};
            const host = val.host || {};
            gameState.id = snap.key;
            gameState.title = val.title;
            let unparsedPlayerKeys = Object.keys(players);
            gameState.players.forEach( (player, key) => {
                const upPK = unparsedPlayerKeys.indexOf(key);
                if ( upPK < 0 ) {
                    gameState.players.delete(key);
                }   else    {
                    unparsedPlayerKeys = unparsedPlayerKeys.splice(upPK, 1);
                    player.update(players[key]);
                }
            } )
            unparsedPlayerKeys.forEach( key => {
                gameState.players.set(key, new Player(key, players[key], ref))
            } )
            if (gameState.host) {
                gameState.host.update(host);
            }   else    {
                gameState.host = new GameMaster(host, ref);
            }

            if (first) {
                first = false;
                res();
            }
        })
    } )
}

export function genGameId(gameRef?: database.Reference) {
    gameState.currentPlayerKey = "host";
    gameState.players = new Map();
    if (gameRef) {
        return __updateFromRef(gameRef);
    }
    const ref = games.push({
        title: !!gameState.id || !gameState.title ? "New Game" : gameState.title,
        players: {},
        host: {
            name: "The Game Lord"
        },
    })

    return __updateFromRef(ref);
}

export function joinGame(gameId: string, playerKey?: string) {
    const ref = games.child(gameId);
    
    gameState.players = new Map();
    if(playerKey) {
        gameState.currentPlayerKey = playerKey;
        return __updateFromRef(ref);
    }

    const playerRefs = ref.child("players").push({
        name: "New Player"
    });
    gameState.currentPlayerKey = playerRefs.key;
    return __updateFromRef(ref);
}

