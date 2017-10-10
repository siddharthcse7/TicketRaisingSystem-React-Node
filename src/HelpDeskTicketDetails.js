import React, { Component } from 'react';
import { apiurl } from './helpers/constants';
import { Table, Row, Col, Jumbotron, Button } from 'react-bootstrap';
import firebase from 'firebase';


class HelpDeskTicketDetails extends Component{

    constructor(props){
        super(props);
        this.state = {
            techUsers: [],
            selectedTech: null,
            priority:null,
            level:null
        }
    }


    /* Close button for dialog */
    closeDialogClick = () => {
        this.setState({
            selectedTick: null
        })
    }

    /* Update the selected tech from dropdown box */
    handleTechChange = (e) => {
        this.setState({
            selectedTech: e.target.value
        });
    }

    /* Update the selected level from dropdown box */
    handleLevelChange = (e) => {
        this.setState({
            level: e.target.value
        });
    }

    /*
    * Update selected priority from dropdown
    * */
    handlePriorityChange = (e) => {
        this.setState({
            priority: e.target.value
        });
    }

    componentDidMount(){
        /* Creates a firebase listener which will automatically
            update the list of tech users every time a new tech
            registers into the system
         */
        const users = firebase.database().ref('user/')
        users.on('value', (snapshot) => {
            const tempTech = [];
            for(const ele in snapshot.val()) {
                if(snapshot.val()[ele].type === 'tech') {
                    tempTech.push(snapshot.val()[ele]);
                }
            }
            this.setState({
                techUsers: tempTech
            });
        })
    }
    /*Click update priority*/
    updatePriority=()=>{
        fetch(apiurl+"/"+this.props.selectedTick.ticketId+"/update", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailId: this.props.selectedTick.emailId,
                subject:this.props.selectedTick.subject,
                priority:this.state.priority,
                serviceArea: this.props.selectedTick.serviceArea,
                preferredContact:this.props.selectedTick.preferredContact,
                operatingSystem:this.props.selectedTick.operatingSystem,
                description:this.props.selectedTick.description,
                status:this.props.selectedTick.status
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.response_status === "SUCCESS") {
                    alert("Priority updated successfully!")
                    this.forceUpdate();
                } else {
                    alert("Could not update priority.")
                }
            })
    }
    /* Click assign button */
    assignTicketToTech = () => {
        if(this.props.selectedTech === null) {
            return;
        }

        /* Add assigned ticket+tech into database*/
        const data = {};
        data['ticket/' + this.props.selectedTick.ticketId] = {
            ticket_id: this.props.selectedTick.ticketId,
            user_id: this.state.selectedTech, // stored Tech ID
            escalation_level: this.state.level
        };
        firebase.database().ref().update(data)
        alert('Tech successfully assigned to ticket!');
        window.location.reload();
    }

    updateSelectedTicketState = () => {
        this.props.viewClick();
    }

    render() {
        const {techUsers} = this.state

        return (

            <div>
                <Button className="btn-success pull-right" onClick={this.updateSelectedTicketState} >Back</Button>
                <legend>View Ticket #{this.props.selectedTick.ticketId}</legend>
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            Ticket Details
                        </h4>
                    </div>
                    <div className="panel-body">

                        <label className="col-lg-2 control-label"><b>Subject: </b></label>
                        <p className="col-lg-10">{this.props.selectedTick.subject}</p><br/>
                        <label className="col-lg-2 control-label"><b>Comment: </b></label>
                        <p className="col-lg-10">{this.props.selectedTick.description}</p><br/>
                        <div>

                            <label className="col-lg-2 control-label"><b>Priority</b></label>
                        {/*Handling priority change*/}
                            <select className="col-lg-10" onChange={this.handlePriorityChange} defaultValue={this.props.selectedTick.priority}>
                                <option value="-1" defaultValue disabled>Select a priority</option>
                                <option value ="H">High</option>
                                <option value ="M">Moderate</option>
                                <option value ="L">Low</option>
                            </select><br/><br/>

                            <div className="clearfix"><br/>
                                <Button className="pull-right" bsStyle="success" onClick={this.updatePriority}>Update Priority</Button>
                            </div>
                        </div>

                        {techUsers.length > 0 && (

                            <div>
                                <div>

                                    <label className="col-lg-2 control-label"><b>Escalation level</b></label>
                                    {/* Handling escalation level change*/}
                                    <select className="col-lg-10" onChange={this.handleLevelChange} defaultValue="-1">
                                        <option value="-1" defaultValue disabled>Select a level</option>
                                        <option value ="1">1</option>
                                        <option value ="2">2</option>
                                        <option value ="3">3</option>
                                    </select>

                                </div><br/><br/>


                                <div>

                                    <label className="col-lg-2 control-label"><b>Assign to tech</b></label>
                                    {/*Displaying all Tech users.*/}
                                    <select className="col-lg-10" onChange={this.handleTechChange} defaultValue="-1">
                                        <option value="-1" defaultValue disabled>Select a tech user</option>
                                        {techUsers.map((user, i) => (
                                            <option key={i} value={user.id}>{user.name}</option>
                                        ))}
                                    </select> <br/><br/>

                                    <div className="clearfix"><br/>
                                        {/*Assigning ticket to a technical user.*/}
                                        <Button className="pull-right" bsStyle="success" onClick={this.assignTicketToTech}>Assign and escalate</Button>
                                    </div>
                                </div>
                            </div>
                        )};
                    </div>
                </div>


            </div>

        );
    }
}
export default HelpDeskTicketDetails;