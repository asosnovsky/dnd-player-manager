import { Attributes } from '@/attr-parser/typings';
import Referenciables from '@/attr-parser/Referenciables';

export interface AttributeProps<Attr> {
    id: string;
    attr: Attr;
    onSave: ( path: string, value: Attr ) => void;
    refs: Referenciables;
}

export interface ICategoryAttributeItemState {
    isOpen: boolean;
    currentNew: Attributes.Attribute["type"] | "" | "points";
    currentNewValue: string;
}