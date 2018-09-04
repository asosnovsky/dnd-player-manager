import * as React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import theme from "@/theme";
import AppRouter from "@/components/router";

export default class App extends React.Component {
    render() {
        return <MuiThemeProvider theme={theme}>
            <AppRouter/>
        </MuiThemeProvider>
    }
}