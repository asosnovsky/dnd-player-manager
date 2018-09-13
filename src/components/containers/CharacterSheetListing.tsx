import * as React from "react";
import { CharacterSheet, ICharacterSheet } from '@/states/CharacterSheets';
import CharacterSheetListing from '@/components/common/CharacterSheetListing';
import { observer } from 'mobx-react';


export interface IProps {
    onLoad: ( cs: ICharacterSheet ) => void;
}

@observer
export default class CharacterSheetListingContainer extends React.Component<IProps> {
    componentWillMount() {
        CharacterSheet.refreshListing();
    }
    render() {
        return <CharacterSheetListing 
                    hasMore={ CharacterSheet.listings && CharacterSheet.listings.length > 10 }
                    hasLess={ !!CharacterSheet.lastStart }
                    listings={CharacterSheet.listings || []} 
                    onLoad={ cs => {
                        this.props.onLoad(cs)
                    } }
                    onChangePage = { req => {
                        if ( req === "next" && CharacterSheet.listings.length === 10 ) {
                            CharacterSheet.refreshListing(CharacterSheet.listings[9].id)
                        }   else  if(req === "prev")   {
                            if ( CharacterSheet.lastStart ) {
                                CharacterSheet.refreshListing(CharacterSheet.lastStart )
                            }
                        }
                    } }
                />
    }
}