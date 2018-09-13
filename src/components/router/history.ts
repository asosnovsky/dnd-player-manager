import { createBrowserHistory } from "history";
import { observable, toJS } from "mobx";
import { PAGES } from "./routes.enums";
export { PAGES }

export const history = createBrowserHistory();
export const state = observable({
    currentPage: window.location.pathname,
})

export function goTo(path: PAGES, ...params: string[]) {
    if ( params.length > 0) {
        return history.push(path + '/' + params.join('/'));
    }
    return history.push(path);
}

export function goHomeOrBack() {
    if (history.action === "POP") {
        history.push("/");
    } else {
        history.goBack();
    }
}

history.listen( location => {
    state.currentPage = location.pathname;
});
