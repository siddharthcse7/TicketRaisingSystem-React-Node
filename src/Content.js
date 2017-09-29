import React, { Component } from 'react';
import './App.css';
import { Navbar, Button, Nav, NavItem, Jumbotron } from 'react-bootstrap';
import firebase from 'firebase';
import { Route, Redirect } from 'react-router';
import Dashboard from './components/Dashboard';
import logo from './logo.svg';
import Login from './components/Login'
class Content extends Component {
    state = {
        type: null,
        user: null
    }

    componentWillMount () {
        firebase.auth().onAuthStateChanged(this.handleCredentials);
    }

    componentWillUnmount() {
        if(this.state.user !== null) {
            localStorage.setItem('type', this.state.type);
        }
    }

    handleClick = (type) => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((success) => { this.handleCredentials(success.user) })
            .then(() => { this.handleLogin(type) });
    }

    handleCredentials = (params) => {
        console.log(params);
        this.setState({
            user: params,
            type: localStorage.getItem('type')
        });
    }

    handleLogin = (type) => {
        localStorage.setItem('type', type);
        this.setState({
            type: type
        });

        /* Add user to our mongodb database */
        /* MongoDB schema - will insert the user's details into the database */
        const user = {};
        user['user/' + this.state.user.uid] = {
            type: type,
            name: this.state.user.displayName,
            id: this.state.user.uid
        };
        firebase.database().ref().update(user)
    }



    render() {
        return (
            <div className="App">


                <div className="container">
                    <Route exact path="/" render={() => (
                        this.state.user === null ? (
                                <Login handleClick={this.handleClick}/>
                            )
                            : (
                                <Redirect to="/dashboard" />
                            )
                    )} />
                    <Route exact path="/dashboard" render={() => (
                        this.state.user !== null ? (
                                <Dashboard user={this.state.user} type={this.state.type} />
                            )
                            : (
                                <Redirect to="/" />
                            )
                    )} />

                </div>
            </div>
        );
    }
}

export default Content;
