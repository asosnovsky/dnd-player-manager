import * as React from "react";
import { Grid, Table, TableBody, TableRow, TableCell, Button, TableFooter, TablePagination, IconButton, TableHead } from '@material-ui/core';
import { ICharacterSheet } from '@/states/CharacterSheets';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';


export interface IProps {
    hasMore: boolean;
    hasLess: boolean;
    listings: ICharacterSheet[];
    onLoad: ( c: ICharacterSheet ) => void;
    onChangePage: ( request: "next" | "prev" ) => void;
}
export default class CharacterSheetListing extends React.Component<IProps> {
    render() {
        return <Grid item>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="dense">Owner</TableCell>
                        <TableCell>Sheet Name</TableCell>
                        <TableCell>Sheet Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.listings.map( (listing, idx) => <TableRow hover key={idx} onClick={ () => {
                            this.props.onLoad(listing)
                        } }>
                        <TableCell padding="dense">{listing.owner}</TableCell>
                        <TableCell>{listing.name}</TableCell>
                        <TableCell>{listing.description}</TableCell>
                    </TableRow> )}
                </TableBody>
                <TableFooter>
                <TableRow>
                    <TablePagination
                        colSpan={3}
                        count={this.props.listings.length}
                        rowsPerPage={10}
                        rowsPerPageOptions={[10]}
                        page={0}
                        onChangePage={ (_, page) => {
                            this.props.onChangePage(
                                page > 0 ? "next" : "prev"
                            )
                        } }
                        ActionsComponent={ (props: any) => <div className={props.className}>
                            <IconButton aria-label="Previous Page" onClick={ e => props.onChangePage(e, -1) } disabled={!this.props.hasLess}>
                                <KeyboardArrowLeft/>
                            </IconButton>
                            <IconButton aria-label="Next Page" onClick={ e => props.onChangePage(e, +1) } disabled={!this.props.hasMore}>
                                <KeyboardArrowRight/>
                            </IconButton>
                      </div> }
                    />
                </TableRow>
            </TableFooter>
            </Table>
        </Grid>
    }
}