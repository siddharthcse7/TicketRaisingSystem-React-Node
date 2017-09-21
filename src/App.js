import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./header";
import Footer from "./footer"
//import {Bootstrap} from 'bootstrap'
import ReactBootstrap, {Nav, Navbar, NavDropdown, NavItem} from 'react-bootstrap';
import {Bootstrap, Grid, Row, Col} from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
        <div>
            <Header/>
            <Footer/>
        </div>
    );
  }
}

export default App;
