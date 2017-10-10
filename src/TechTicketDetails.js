import React, { Component } from 'react';
import {Button, Collapse, Fade, Panel,Well} from 'react-bootstrap';
import {apiurl_comment, apiurl} from "./helpers/constants";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'


class TechTicketDetails extends Component{
    constructor(props) {
        super(props);

        this.state = {
            comments: [],
            status: this.props.selectedTick.status,
            commentDescription: null,
            newComment: null,
            allowCloseTicket:null
        };
    }

    updateSelectedTicketState = () => {
        this.props.viewClick();
    }


    componentDidMount() {
        fetch(apiurl_comment +'/'+this.props.selectedTick.ticketId+ '/comments')
            .then((response) => response.json())
            .then((responseJson) => {
                const myComments = [];
                for(const ele in responseJson) {
                    myComments.push(responseJson[ele]);

                    /* Force the view to re-render (async problem) */
                    this.forceUpdate();
                }
                console.log(JSON.stringify(myComments))
                return myComments;
            })
            .then((comments) => {
                this.setState({
                    comments: comments
                });
            })
    }
    handleStatusChange= (e) => {
        this.setState({
            status: e.target.value
        });

    }

    updateCommentDescription = (value) => {
        this.setState({
            newComment:value,
        });
    };


    /*Click update status*/
    updateStatus=()=>{
        fetch(apiurl+"/"+this.props.selectedTick.ticketId+"/update", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailId: this.props.selectedTick.emailId,
                subject:this.props.selectedTick.subject,
                priority:this.props.selectedTick.priority,
                serviceArea: this.props.selectedTick.serviceArea,
                preferredContact:this.props.selectedTick.preferredContact,
                operatingSystem:this.props.selectedTick.operatingSystem,
                description:this.props.selectedTick.description,
                status:this.state.status
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.response_status === "SUCCESS") {
                    alert("Status updated successfully!")
                    if(this.state.status == "Resolved" ||this.state.status == "Unresolved" || this.state.status == "Closed"){
                        this.state.allowCloseTicket = true;
                    }else{
                        this.state.allowCloseTicket = null;
                    }
                    this.forceUpdate();
                    //window.location.reload();
                } else {
                    alert("Could not update status.")
                }
            })
    }



    postComment=()=>{
        console.log(JSON.stringify({
            commentId: "1",
            description: this.state.newComment,
            ticketId:this.props.selectedTick.ticketId,
            emailId:this.props.loggedInUser.email

        }));

        //  var fullComment= this.getFullComment();

        fetch(apiurl_comment, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                commentId: "1",
                description: this.state.newComment,
                ticketId:this.props.selectedTick.ticketId,
                emailId:this.props.loggedInUser.email

            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.response_status === "SUCCESS") {
                    alert("Comment added successfully!")
                    this.state.comments.push({
                        description:this.state.newComment,
                        ticketId:this.props.selectedTick.ticketId,
                        emailId:this.props.loggedInUser.email

                    });
                    this.state.newComment = null;
                    this.forceUpdate();
                } else {
                    alert("Could not update status.")
                }
            })
    }

    closeTicket = () => {

        fetch(apiurl+"/"+this.props.selectedTick.ticketId+"/update", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailId: this.props.selectedTick.emailId,
                subject:this.props.selectedTick.subject,
                priority:this.props.selectedTick.priority,
                serviceArea: this.props.selectedTick.serviceArea,
                preferredContact:this.props.selectedTick.preferredContact,
                operatingSystem:this.props.selectedTick.operatingSystem,
                description:this.props.selectedTick.description,
                status:"Closed"
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.response_status === "SUCCESS") {
                    alert("Status updated successfully!")
                    this.forceUpdate();
                    //window.location.reload();
                } else {
                    alert("Could not update status.")
                }
            })
    }
    render(){
        const { editorState } = this.state;
        return(

            <div id="mainBody">
                <div className="pull-right">
                    <Button className="btn-warning" onClick={this.updateSelectedTicketState} >Back</Button>
                    <Button className="btn-danger" onClick={this.closeTicket} disabled={!this.state.allowCloseTicket}>Close Ticket</Button>
                </div>
                <legend>View Ticket #{this.props.selectedTick.ticketId}</legend>

                <div className="panel panel-info disabled">
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            Ticket Details
                        </h4>
                    </div>
                    <div className="panel-body">
                        <div className="form-group">
                            <div>
                                <label className="col-lg-2 control-label" >Subject: </label>
                                <p className="col-lg-10" > {this.props.selectedTick.subject} </p><br/>
                            </div><br/>
                            <div>
                                <label className="col-lg-2 control-label" >Description: </label>
                                <p className="col-lg-10" > {this.props.selectedTick.description} </p><br/>
                            </div><br/>
                            <div>
                                <label className="col-lg-2 control-label" >OS: </label>
                                <p className="col-lg-10" > {this.props.selectedTick.operatingSystem} </p><br/>
                            </div><br/>
                            <div>
                                <label className="col-lg-2 control-label" >Service Area: </label>
                                <p className="col-lg-10" > {this.props.selectedTick.serviceArea} </p><br/>
                            </div><br/>

                            <div>
                                <label className="col-lg-2 control-label" >Email Adrress: </label>
                                <p className="col-lg-10" > {this.props.selectedTick.emailId} </p><br/>
                            </div>
                            <div>
                                <label className="col-lg-2 control-label" >Status</label>
                                <select className="col-lg-7"  onChange={this.handleStatusChange} defaultValue={this.props.selectedTick.status} disabled={this.props.selectedTick.status == 'Closed'}>
                                    <option value ="Pending">Pending</option>
                                    <option value ="In Progress">In Progress</option>
                                    <option value ="Resolved">Resolved</option>
                                    <option value ="Unresolved">Unresolved</option>
                                    <option value="Closed" disabled>Closed</option>
                                </select>
                                <Button className="btn btn-infobtn btn-info" onClick={this.updateStatus} >Update Status</Button>
                            </div>


                        </div><br/>

                    </div>

                </div>
                <div className="panel panel-success">
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            Add comment

                        </h4>

                    </div>
                    <div className="panel-body">
                        <div style={{marginTop:10 }}>

                            <div className="col-lg-12">

                                <ReactQuill value={this.state.newComment}
                                            onChange={this.updateCommentDescription} />
                            </div>

                        </div>
                        <Button className="btn btn-info pull-right" onClick={this.postComment} >Post Comment</Button>
                    </div>
                </div>

                {this.state.comments.length < 1 ? (
                    <p className="alert alert-info">There are no comments to display.</p>
                ):(

                    this.state.comments.map((comment, i) => (

                            <div key={i} className="panel panel-danger">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Commented By: {comment.emailId}</h3>
                                </div>
                                <div className="panel-body" dangerouslySetInnerHTML={{ __html: comment.description }}>

                                </div>
                            </div>
                        )


                    )

                )};
            </div>
        );
    }
}
export default TechTicketDetails;