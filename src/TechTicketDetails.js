import React, { Component } from 'react';
import {Button, Collapse, Fade, Panel,Well} from 'react-bootstrap';
import {apiurl_comment, apiurl} from "./helpers/constants";
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw } from 'draft-js';



class TechTicketDetails extends Component{
    constructor(props) {
        super(props);

        this.state = {
            comments: [],
            status:null,
            commentDescription: null,
            editorState: EditorState.createEmpty(),

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

    updateCommentDescription = (editorState) => {
        this.setState({
            editorState,
        });
    };

    /*updateCommentDescription=(e)=>{
        console.log(e.target.value)
        this.setState({
            commentDescription: e.target.value
        });

    }*/

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
                    this.forceUpdate();
                } else {
                    alert("Could not update status.")
                }
            })
    }


    postComment=()=>{
        console.log(convertToRaw(this.state.editorState.getCurrentContent()));
        const x = JSON.stringify({
            commentId: "1",
            description: this.state.editorState,
            ticketId:this.props.selectedTick.ticketId,
            emailId:this.props.selectedTick.emailId
        })
        console.log(x)
        fetch(apiurl_comment, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                commentId: "1",
                description:this.state.editorState,
                ticketId:this.props.selectedTick.ticketId,
                emailId:this.props.selectedTick.emailId

            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.response_status === "SUCCESS") {
                    alert("Comment added successfully!")
                    this.state.comments.push({
                        description:this.state.editorState,
                        ticketId:this.props.selectedTick.ticketId,
                        emailId:this.props.selectedTick.emailId

                    });
                    this.forceUpdate();
                } else {
                    alert("Could not update status.")
                }
            })
    }

render(){
    const { editorState } = this.state;
        return(

            <div id="mainBody">
                <Button onClick={this.updateSelectedTicketState} >Back</Button>
                <legend>View Ticket #{this.props.selectedTick.ticketId}</legend>

                <div className="panel panel-primary">
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
                                <select className="col-lg-7"  onChange={this.handleStatusChange} defaultValue={this.props.selectedTick.status}>
                                    <option value ="In Progress">In Progress</option>
                                    <option value ="Resolved">Resolved</option>
                                    <option value ="Closed">Closed</option>
                                </select>
                                <Button className="btn btn-info" onClick={this.updateStatus} >Update Status</Button>
                            </div>

                            <div style={{marginTop:10 }}>
                            <label htmlFor="textArea" className="col-lg-2 control-label">Comment:</label>
                                <div className="col-lg-7">
                                    {/*        <textarea className="form-control" rows="3" id="commentTextArea" onChange={this.updateCommentDescription} ></textarea>*/}
                                    <Editor
                                        editorState={editorState}
                                        toolbarClassName="toolbarClassName"
                                        wrapperClassName="wrapperClassName"
                                        editorClassName="editorClassName"
                                        onEditorStateChange={this.updateCommentDescription}
                                    />
                                </div>
                                <Button className="btn btn-info" onClick={this.postComment} >Post Comment</Button>
                            </div>
                        </div><br/>

                    </div>

                </div>
                {this.state.comments.length < 1 ? (
                    <p className="alert alert-info">There are no comments to display.</p>
                ):(

                    this.state.comments.map((comment, i) => (

                            <div key={i} className="panel panel-danger">
                                <div className="panel-heading">
                                    <h3 className="panel-title">@{this.props.selectedTick.emailId}</h3>
                                </div>
                                <div className="panel-body">
                                    {comment.description}
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