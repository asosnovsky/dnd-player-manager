import PlayerBase, { PlayerBaseData } from "@/states/Players/Base";
import { database } from "firebase";

export interface PlayerData extends PlayerBaseData {
}
export default class Player extends PlayerBase<PlayerData> {
    constructor(id: string, data: PlayerData, gameDataRef: database.Reference) {
        super(
            id, "player", 
            data, gameDataRef
        )
    }
}