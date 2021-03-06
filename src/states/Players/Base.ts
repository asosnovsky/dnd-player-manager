import { observable, toJS, computed } from "mobx";
import { database } from "firebase";

export interface PlayerBaseData {
    name: string;
}
export default class PlayerBase<Data extends PlayerBaseData> {

    @observable public id: string;
    @observable public role: "player" | "gm";
    @observable public data: Data;
    @computed get name() {
        return this.data.name;
    }

    constructor(
        id: string,        
        role: "player" | "gm",        
        data: Data,
        private databaseRef: database.Reference,
    ){
        this.id = id;
        this.role = role;
        this.data = data;
    }

    toJson() {
        return {
            id: toJS(this.id),
            role: toJS(this.role),
            data: toJS(this.data),
        }
    }

    update(data: Partial<Data>) {
        this.data = {
            ...(this.data as any),
            ...(data as any)
        }
        return this;
    }

    async save() {
        const { id, role, data } = this.toJson();
        console.log({
            id, role, data, key: this.databaseRef.key,
        })
        if ( role === "gm" ) {
            return await this.databaseRef.child(`host`).set({
                role, data,
            }).then();
        } 
        return await this.databaseRef.child(`users/${id}`).set({
            role, data,
        }).then();
    }
}