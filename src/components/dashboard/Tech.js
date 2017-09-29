import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import firebase from 'firebase';
import {Button, Panel, Table} from 'react-bootstrap';

class Tech extends Component {
    state = {
        tickets: [],
        selectedTicket: null
    }

    /* Toggle the ticket dialog */
    ticketDetailsClick = (ticket) => {
        const { selectedTicket } = this.state;
        this.setState({
            selectedTicket: (selectedTicket !== null && selectedTicket.ticketId === ticket.ticketId ? null : ticket)
        });
    }


    componentDidMount() {
        /* Fetch all tickets and check which tickets have
            been assigned to this tech user
         */
        fetch(apiurl + '/list')
            .then((response) => response.json())
            .then((responseJson) => {
                const myTickets = [];
                for(const ele in responseJson) {
                    firebase.database().ref('ticket/'+responseJson[ele].ticketId).on('value', (snapshot) => {
                        if(snapshot.val() !== null && snapshot.val().user_id === this.props.user.uid) {
                            myTickets.push(responseJson[ele]);

                            /* Force the view to re-render (async problem) */
                            this.forceUpdate();
                        }
                    })
                }
                return myTickets;
            })
            .then((tickets) => {
                this.setState({
                    tickets: tickets
                });
            })
    }

    render () {
        const { tickets } = this.state;
        return (
            <div>
                <h1>My Tickets</h1>
                {tickets.length < 1 ? (
                    <div className="alert alert-info">You have not been assigned any tickets.</div>
                )
                : tickets.map((ticket, i) => (

                    <Table striped hover>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Subject</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tickets.map((ticket, i) => (
                            <tr key={i}>
                                <td>{ticket.ticketId}</td>
                                <td>{ticket.subject}</td>
                                <td>{ticket.priority}</td>
                                <td>{ticket.status}</td>
                                <td>
                                    <Button bsStyle={this.state.selectedTicket !== null && this.state.selectedTicket.ticketId === ticket.ticketId ? 'success' : 'info'} onClick={() => this.ticketDetailsClick(ticket)} >View</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    /*    <Panel key={i} header={ticket.subject}  >
                            <p>Description: {ticket.description}</p>
                            <p>Status: {ticket.status}</p>
                            <p>ID: {ticket.ticketId}</p>
                            <p>{ticket.comment}</p>

                     </Panel>*/
                ))}
            </div>
        );
    }
}

export default Tech;