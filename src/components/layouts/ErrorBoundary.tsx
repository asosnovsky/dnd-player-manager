import * as React from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";

interface State {
    error?: Error;
    errorInfo?: React.ErrorInfo;
}
export default class ErrorBoundary extends React.Component<{}, State> {
    public state: State = {};
    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        });
        console.error(error);
        console.error(errorInfo);
    }
    public render() {
        if (this.state.error) {
            return <Card>
                <CardHeader style={{
                    color: "red"
                }} title="Oh oh, an error has occured!"/>
                <CardContent color="error">
                    <Typography variant="subheading">
                        {this.state.error.toString()}
                    </Typography>
                    <Typography>{this.state.errorInfo.componentStack}</Typography>
                </CardContent>
            </Card>;
        } else {
            return this.props.children;
        }
    }
}
