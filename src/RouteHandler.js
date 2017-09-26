import React from 'react';
import App from './App'
import {Switch, Route} from 'react-router-dom';
import Content from "./Content";
import Dashboard from "./components/Dashboard";



class RouteHandler extends  React.Component{

    render(){
        return (

            <div>
                <Switch>

                    <Route exact path="/" component={Content} />
                    <Route path="/dashboard" component={Dashboard} />


                </Switch>


            </div>

        );
    }


}