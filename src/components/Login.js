

import  React from "react";
import { Navbar, Button, Nav, NavItem, Jumbotron } from 'react-bootstrap';
import logo from '../logo.svg';
class Login extends React.Component{

    handleClick=(userType)=>{
        this.props.handleClick(userType);
    }

    render(){
        return(
            <Jumbotron className="text-center">
                <img src={logo} className="App-logo" alt="logo" style={{width:200}} />
                <h1>Sign in to continue</h1>
                <p>
                    Please select your account type:
                </p>

                <div className="text-center">
                    <Button bsSize="large" bsStyle="primary" style={{marginRight:10}} onClick={() => this.handleClick('helpdesk')}>Helpdesk User</Button>
                    <Button bsSize="large" bsStyle="success" onClick={() => this.handleClick('tech')}>Tech User</Button>
                </div>
            </Jumbotron>
        );
    }

}
export default Login;