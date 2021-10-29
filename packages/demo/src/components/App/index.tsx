import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Router } from 'react-router-dom';
import { createBrowserHistory } from "history";

import { MainContainer } from "@components";

interface IProps { }

@inject()
@observer
class App extends React.Component<IProps> {

    // render() {
    //     return (
    //         <Router history={createBrowserHistory()}>
    //             <Route path="/" component={MainContainer}/>
    //         </Router>
    //     );
    // }

    render() {
        return (<MainContainer />);
    }
}

export { App };
