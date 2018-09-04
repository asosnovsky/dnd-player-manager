import PlayerBase, { PlayerBaseData } from "@/states/Players/Base";
import { database } from "firebase";

export interface GameMasterData extends PlayerBaseData {
}
export default class GameMaster extends PlayerBase<GameMasterData> {
    constructor(data: GameMasterData, gameDataRef: database.Reference) {
        super(
            "host", "gm", 
            data, gameDataRef
        )
    }
}