import React, { Component } from 'react';
import './App.css';
import {Nav, Navbar, NavDropdown, NavItem} from 'react-bootstrap';
import firebase from 'firebase';


class Header extends Component {

    handleSignout = () => {
        const vm = this;
        vm.setState({
            user: null,
            type: null
        });
        localStorage.setItem('type', null);
        firebase.auth().signOut().then(function () {
            alert('You have been signed out');
        });
    }


  render() {
    return (
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Ticket System</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
              {/*Show signout option if user is logged in*/}
              {this.props.userKey !== null &&
              <NavItem onClick={this.handleSignout}>Sign out</NavItem>
              }
          </Nav>
        </Navbar>
    );
  }
}

export default Header;
