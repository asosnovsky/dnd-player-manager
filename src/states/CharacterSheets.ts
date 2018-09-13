import DBObject from '@/db/DBObject';
import { Attributes } from '@/attr-parser/typings';
import { characterSheets, auth } from '@/db';
import { observable, computed } from 'mobx';


export interface ICharacterSheet {
    id?: string;
    tree: Attributes.Category;
    name: string;
    description: string;
    owner: string;
}
export class CharacterSheet extends DBObject<ICharacterSheet> {
    get id() { return this.get('id'); }
    get tree(): Attributes.Category { return {
        name: "$root", type: "category", attributes: {},
        ...(this.get('tree') || {})
    }; }
    get name() { return this.get("name"); }
    get description() { return this.get("description"); }

    @observable static listings: Array<ICharacterSheet & { id: string }> = [];
    @observable static lastStart: string = null;
    
    constructor(data: ICharacterSheet) {
        if ( 'id' in data ) {
            super(data, characterSheets.child(data.id))
        }   else    {
            const ref = characterSheets.push(data)
            data.id = ref.key;
            super( data, ref );
        }
    }
    static refreshListing( startAt?: string ) {
        let ref: firebase.database.Query;
        if ( startAt ) {
            ref = characterSheets.startAt(startAt)
            if ( CharacterSheet.listings && CharacterSheet.listings.length > 0 ) {
                CharacterSheet.lastStart = CharacterSheet.listings[0].id;
            }
        }   else    {
            ref = characterSheets;
            CharacterSheet.lastStart = null;
        }
        ref.limitToFirst(11).once('value', snap => {
            const val = snap.val();
            CharacterSheet.listings = Object.keys( val ).map( k => ({
                id: k,
                ...val[k],
            }) )
        })
    }
    static async loadFromId( id: string ): Promise<CharacterSheet> {
        return new Promise<any>( (res, rej) => {
            characterSheets.child(id).once('value', snap => {
                console.log("Loading sheet...", id)
                if (!snap.exists()) {
                    console.error("NOT FOUND")
                    rej("Sheet Not Found");
                }
                const data = snap.val();
                console.log(data)
                res(new CharacterSheet({
                    id,
                    ...data,
                }))
            })
        } )
    }
}