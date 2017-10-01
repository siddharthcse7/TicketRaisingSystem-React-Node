import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from "react-router-dom";
import firebase from 'firebase'

// THIS SHOULD BE YOUR SETTING FROM FIREBASE
// YOU CAN RETRIEVE THESE AFTER CREATING YOUR FIREBASE PROJECT

const config = {
    apiKey: "AIzaSyBCz256CNSFeln2k3FSeK7SilwS0vjvMJA",
    authDomain: "trsystem-74b56.firebaseapp.com",
    databaseURL: "https://trsystem-74b56.firebaseio.com",
    projectId: "trsystem-74b56",
    storageBucket: "trsystem-74b56.appspot.com",
    messagingSenderId: "1030006970470"
};

firebase.initializeApp(config);

ReactDOM.render(
    <BrowserRouter>
        <App/>

</BrowserRouter>, document.getElementById('root'));

registerServiceWorker();