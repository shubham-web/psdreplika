import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import mockuplist from "./../mockuplist";
class Home extends Component {
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
                <h1 className="centered">Choose One of the Mockups Below</h1>
                <div className="pr_mockuplist">
                    {this.mockups.map((mockcup) => {
                        return (
                            <div
                                className="pr_mockup"
                                key={mockcup.id}
                                onClick={() => {
                                    this.setState({
                                        redirect: `/editor/${mockcup.id}`,
                                    });
                                }}
                            >
                                <img
                                    src={mockcup.thumb}
                                    alt="mockup thumbnail"
                                    draggable={false}
                                />
                                <h3>{mockcup.title}</h3>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Home;
