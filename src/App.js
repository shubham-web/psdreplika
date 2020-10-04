import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
// Pages
import Home from "./components/Home";
import MockupEditor from "./components/MockupEditor";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route
                        exact
                        path="/editor/:mockupid"
                        component={MockupEditor}
                    ></Route>
                    {/* <Route exact>
                        <Redirect to="/" />
                    </Route> */}
                </Switch>
            </React.Fragment>
        );
    }
}
export default App;
