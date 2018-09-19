import { Formulas, Attributes } from '@/attr-parser/typings';

interface IReturnGetAllReferanciables {
    referenciables: Record<string, Attributes.ReferentiableAttribute>;
    listing:Array<Attributes.ReferentiableAttribute>;
}
export default class Referenciables {
    
    public static fromTree(tree: Attributes.Category) {
        const { listing, referenciables } = Referenciables.getAllReferanciables(tree);
        return new Referenciables(
            referenciables,
            listing,
        )
    }

    private static getAllReferanciables( tree: Attributes.Category, inListing:IReturnGetAllReferanciables["listing"] = [], rootKey: string = "$root") : IReturnGetAllReferanciables {
        let referenciables: IReturnGetAllReferanciables["referenciables"] = {};
        let listing = [...inListing];

        Object.keys(tree.attributes).forEach( key => {
            const attr = tree.attributes[key];
            const childKey = rootKey + "/attributes/" + key;
            if ([
                "number", "computed-number", 
                "enum"  , "computed-enum"
            ].includes(attr.type)) {
                referenciables[childKey] = {...attr, key: childKey} as Attributes.ReferentiableAttribute;
                listing.push(referenciables[childKey]);
            }   else if ( attr.type === "category" ){ 
                const resp = this.getAllReferanciables(attr, listing, childKey);
                listing = resp.listing;
                referenciables = {
                    ...referenciables,
                    ...resp.referenciables,
                }
            }
        } )
    
        return { referenciables, listing };
    }

    constructor(
        private referenciables: IReturnGetAllReferanciables["referenciables"],
        private listing: IReturnGetAllReferanciables["listing"] = [],
    ){}

    getRef(key: string, error: boolean = false) {
        if (key in this.referenciables) {
            return this.referenciables[key];
        }   else    if (error) {
            throw new Error(`Could not find ref to...${key}`)
        }
        return null;
    }

    getFilteredByIdCopy(id: string) {
        const newRefs: IReturnGetAllReferanciables["referenciables"] = {};
        const newListing = this.listing.filter( listItem => {
            console.log({
                cond: listItem.key.indexOf(id) === -1,
                key: listItem.key,
                id,
            })
            if (listItem.key.indexOf(id) === -1) {
                newRefs[listItem.key] = this.referenciables[listItem.key];
                return true;
            }
            return false;
        } );
        return new Referenciables(
            newRefs,
            newListing,
        )
    }

    get items() {
        return this.listing;
    }

}