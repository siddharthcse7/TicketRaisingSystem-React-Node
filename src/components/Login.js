

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
               {/* <img src={logo} className="App-logo" alt="logo" style={{width:200}} />*/}
                <h1>Login</h1>


                <div className="text-center">
                    {/*Button to log into Help desk panel*/}
                    <Button bsSize="large" bsStyle="primary" style={{marginRight:10}} onClick={() => this.handleClick('helpdesk')}>Helpdesk User</Button>
                    {/*Button to log into Tech panel*/}
                    <Button bsSize="large" bsStyle="success" onClick={() => this.handleClick('tech')}>Tech User</Button>
                </div>
            </Jumbotron>
        );
    }

}
export default Login;