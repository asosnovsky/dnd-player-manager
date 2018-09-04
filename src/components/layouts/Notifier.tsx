import * as React from "react";
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Snackbar } from '@material-ui/core';

const state = observable({
    show: false,
    text: "",
})

@observer
export default class Notifier extends React.Component {
    static notify(text:string, waitFor:number = 0, keepFor:number = 2000) {
        window.setTimeout(() => {
            state.text = text;
            state.show = true;
            window.setTimeout(() => state.show = false, keepFor);
        })
    }

    render() {
        return <Snackbar open={state.show} message={state.text}/>
    }
}