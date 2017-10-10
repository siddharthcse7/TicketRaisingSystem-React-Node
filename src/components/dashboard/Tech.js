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

        this.fetchTickets();
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


    fetchTickets=()=>{
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
    //Fetching tickets when component mounted.
    componentDidMount() {
        this.fetchTickets();
    }

    escalateTicketClick = (ticket) => {

        /* escalate the ticket*/
        const data = {};
        data['ticket/' + ticket.ticketId] = {
            ticket_id: ticket.ticketId,
            user_id: null, // unassigning the ticket from the tech user.
          //  escalation_level: ticket.level,
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
                {/*if no ticket is selected*/}
                {this.state.selectedTicket == null && (
                    <h1>My Tickets</h1>
                )}

                {/*If there are no tickets assigned*/}
                {this.state.selectedTicket == null && (

                    tickets.length < 1 ? (
                    <div className="alert alert-info">You have not been assigned any tickets.</div>
                    )
                    :
                    /*If there are tickets to display*/
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
                    {/*Looping through tickets to display*/}
                    {tickets.map((ticket, i) => (
                        <tr key={i}>
                            <td>{ticket.ticketId}</td>
                            <td>{ticket.subject}</td>
                            <td>{ticket.priority}</td>
                            <td>{ticket.status}</td>
                            <td>
                                {/*View ticket details button*/}
                                <Button bsStyle={this.state.selectedTicket !== null && this.state.selectedTicket.ticketId === ticket.ticketId ? 'success' : 'info'} onClick={() => this.ticketDetailsClick(ticket)} >View</Button>
                                {/*Escalate ticket to help desk user button*/}
                                <Button bsStyle= 'danger' onClick={() => this.escalateTicketClick(ticket)} >Escalate</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    </Table>)}


                {this.state.selectedTicket !== null && (
                    //Rendering tech ticket details component
                    <TechTicketDetails viewClick={this.viewButtonClickMethod} selectedTick={this.state.selectedTicket} loggedInUser={this.props.user} />
                ) }

            </div>
        );
    }
}

export default Tech;