import { Formulas, Attributes } from '@/attr-parser/typings';

export default class Referenciables {
    
    private referenciables: Record<string, Attributes.ReferentiableAttribute>;
    private iters: Array<Attributes.ReferentiableAttribute> = [];

    constructor(
        private tree: Attributes.Category
    ){
        this.referenciables = this.getAllReferanciables(this.tree, this.iters);
    }

    private getAllReferanciables( tree: Attributes.Category, listing:Array<Attributes.ReferentiableAttribute>, rootKey: string = "$root") : Record<string, Attributes.ReferentiableAttribute> {
        let ret: Record<string, Attributes.ReferentiableAttribute> = {};
    
        Object.keys(tree.attributes).forEach( key => {
            const attr = tree.attributes[key];
            if ([
                "number", "computed-number", 
                "enum"  , "computed-enum"
            ].includes(attr.type)) {
                ret[rootKey + "." + key] = {...attr, key: rootKey + "." + key} as Attributes.ReferentiableAttribute;
                listing.push(ret[rootKey + "." + key]);
            }   else if ( attr.type === "category" ){ 
                ret = {
                    ...ret,
                    ...this.getAllReferanciables(attr, listing, rootKey + "." + key),
                }
            }
        } )
    
        return ret;
    }

    getRef(key: string, error: boolean = false) {
        if (key in this.referenciables) {
            return this.referenciables[key];
        }   else    if (error) {
            throw new Error(`Could not find ref to...${key}`)
        }
        return null;
    }

    get items() {
        return this.iters;
    }

}