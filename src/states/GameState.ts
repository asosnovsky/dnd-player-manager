import { observable, action, computed, toJS, observe, reaction } from "mobx";

import { games } from "@/db";
import * as cache from "@/cache";
import GameMaster from "@/states/Players/GameMaster";
import Player from "@/states/Players/Player";

class GameState {
    @observable id: string;
    @observable title: string;
    @observable currentPlayerKey: string | 'host';
    
    @observable host: GameMaster;
    @observable players = new Map<string, Player>();

    @action reset() {
        this.id = undefined;
        this.title = undefined;
        this.currentPlayerKey = undefined;
        this.host = undefined;
        this.players = new Map();
    }

    @action updatePlayerName(newName: string) {
        const player = this.curretPlayer;
        if (!player)  throw new Error("Cannot update player.name without an existing game.")
        return player.update({ name: newName }).save()
    }

    @computed get ref() {
        return games.child(this.id)
    }
    
    @computed get curretPlayer() : Player | GameMaster {
        if (this.currentPlayerKey === 'host') {
            if (this.host) {
                return this.host;
            }
        }   else    {
            const player = this.players.get(this.currentPlayerKey);
            if (player) {
                return player;
            }
        }
        return null;
    }

    @computed get curretPlayerName() : string {
        const player = this.curretPlayer;
        if (player) {
            return player.data.name;
        }
        return "";
    }

    @computed get isHost(): boolean {
        return this.currentPlayerKey === 'host';
    }

    saveMeta() {
        this.ref.update({
            title: toJS(this.title)
        })
    }

}

export const gameState = new GameState();

reaction(() => gameState.id, () => {
    cache.save("gameId", toJS(gameState.id))
});
reaction(() => gameState.currentPlayerKey, () => {
    cache.save("userKey", toJS(gameState.currentPlayerKey))
});