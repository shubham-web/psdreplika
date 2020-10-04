import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import mockuplist from "../mockuplist";
class MockupEditor extends Component {
    constructor(props) {
        super(props);
        this.mockups = mockuplist;
        this.state = {
            redirect: null,
        };
    }
    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />;
        }
        return (
            <div className="pr_container">
                <h1 className="centered">Edit your mockup.</h1>
            </div>
        );
    }
}

export default MockupEditor;
