import React, { Component } from 'react';
import { apiurl } from '../../helpers/constants';
import { Table, Row, Col, Jumbotron, Button } from 'react-bootstrap';
import firebase from 'firebase';
import HelpDeskTicketDetails from "../../HelpDeskTicketDetails";
class Helpdesk extends Component {
    state = {
        tickets: [],
        selectedTicket: null
    }

    /* Once component has mounted, fetch from API + firebase */
    componentDidMount() {
        /* Fetch all tickets and check which tickets have
            an assigned tech
         */
        fetch(apiurl + '/list')
            .then((response) => response.json())
            .then((responseJson) => {
                const pendingTickets = [];
                for(const ele in responseJson) {
                    firebase.database().ref('ticket/'+responseJson[ele].ticketId).on('value', (snapshot) => {
                        if(snapshot.val() === null || snapshot.val().escalated_by != null) {
                            pendingTickets.push(responseJson[ele]);

                            /* Force the view to re-render (async problem) */
                            this.forceUpdate();
                        }
                    })
                }

                return pendingTickets;
            })
            .then((tickets) => {
                this.setState({
                    tickets: tickets
                });
            })


    }


    fetchTickets = () => {

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


    /* Render the page! */
    /* TODO : Complete in your own time:
        Do you think you could split this page into separate sub-components?
     */
    render () {
        const vm = this
        const { selectedTicket, tickets } = this.state

        return (
            <div>

                {this.state.selectedTicket == null && (
                    tickets.length < 1 ?(
                        <p className="alert alert-info">There are no tickets to display.</p>
                    ):
                    <Row>
                    <Col md={12}>
                    <h1>Pending Tickets</h1>
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
                                <Button bsStyle={vm.state.selectedTicket !== null && vm.state.selectedTicket.ticketId === ticket.ticketId ? 'success' : 'info'} onClick={() => vm.ticketDetailsClick(ticket)}>More Details</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    </Table>
                    </Col>
                    </Row>)}
                {selectedTicket !== null && (

                    <HelpDeskTicketDetails viewClick={this.viewButtonClickMethod} selectedTick={vm.state.selectedTicket}/>

                )}

            </div>
        );
    }
}

export default Helpdesk;