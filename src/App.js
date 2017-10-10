import React, { Component } from 'react';
import './App.css';
import { Navbar, Button, Nav, NavItem, Jumbotron } from 'react-bootstrap';
import firebase from 'firebase';
import { Route, Redirect } from 'react-router';
import logo from './logo.svg';
import Content from "./Content";
import Header from "./header";
import Footer from "./footer";

class App extends Component {
    state = {
        type: null,
        user: null
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(this.handleCredentials);
    }

    componentWillUnmount() {
        if (this.state.user !== null) {
            localStorage.setItem('type', this.state.type);
        }
    }

    handleClick = (type) => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((success) => {
                this.handleCredentials(success.user)
            })
            .then(() => {
                this.handleLogin(type)
            });
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
            <div>
                <Header userKey={this.state.user}/>
                <Content />
                <Footer/>
            </div>
        );

    }
}

export default App;
