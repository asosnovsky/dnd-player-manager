import { database } from "firebase";
import { observable } from 'mobx';

export interface DBObjectData {
}
export default class DBObject<Data extends DBObjectData> {
    @observable public data: Data;
    constructor(
        data: Data,
        private ref: database.Reference,
    ){
        this.data = data;
    }

    toJson(): Data {
        return JSON.parse(JSON.stringify(this.data));
    }

    update(data: Partial<Data>) {
        this.data = {
            ...(this.data as any),
            ...(data as any)
        }
        return this;
    }

    save() {
        const data = this.toJson();
        return this.ref.update(data);
    }

    get<Key extends keyof Data>(key: Key): Data[Key] {
        return this.data[key];
    }
}