import React, { Component } from 'react';
import { apiurl } from "../../helpers/constants";
import firebase from 'firebase';
import {Button, Col, Panel, Table} from 'react-bootstrap';
import TechTicketDetails from "../../TechTicketDetails";

class Tech extends Component {
    state = {
        tickets: [],

        selectedTicket: null
    }

    viewButtonClickMethod = () => {


        this.setState({
            selectedTicket: null
        })


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

    escalateTicketClick = (ticket) => {

        /* escalate the ticket*/
        const data = {};
        data['ticket/' + ticket.ticketId] = {
            ticket_id: ticket.ticketId,
            user_id: null, // unassigning the ticket from the tech user.
            escalation_level: ticket.level,
            escalated_by: this.props.user.displayName
        };
        firebase.database().ref().update(data)
        alert('Ticket escalated successfully!');
        window.location.reload();
    }

    render () {
        const { tickets } = this.state;
        return (
            <div>
                {this.state.selectedTicket == null && (
                    <h1>My Tickets</h1>
                )}


                {this.state.selectedTicket == null && (

                    tickets.length < 1 ? (
                    <div className="alert alert-info">You have not been assigned any tickets.</div>
                    )
                    :

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
                                <Button bsStyle= 'danger' onClick={() => this.escalateTicketClick(ticket)} >Escalate</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    </Table>)}


                {this.state.selectedTicket !== null && (
                    <TechTicketDetails viewClick={this.viewButtonClickMethod} selectedTick={this.state.selectedTicket} />
                ) }


                {/*    <Panel key={i} header={ticket.subject}  >
                            <p>Description: {ticket.description}</p>
                            <p>Status: {ticket.status}</p>
                            <p>ID: {ticket.ticketId}</p>
                            <p>{ticket.comment}</p>

                     </Panel>*/}

            </div>
        );
    }
}

export default Tech;