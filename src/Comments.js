import React, { Component } from 'react';
import { Collapse, Fade} from 'react-bootstrap';
class Comments extends Component{
    constructor(props) {
        super(props);

        this.state = {};
    }

    render(){
        return(
            <div id="mainBody">

                <legend>View Ticket #TicketId</legend>
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            <a onClick={ ()=> this.setState({ open: !this.state.open })}><span className="glyphicon glyphicon-comment">
                            </span>Add Comment</a>
                        </h4>
                    </div>
                    <Fade in={this.state.open} id="collapseOne" className="panel-collapse collapse ">
                        <div className="panel-body">
                            <div className="form-group">
                                <label htmlFor="textArea" className="col-lg-2 control-label">Textarea</label>
                                <div className="col-lg-10">
                                    <textarea className="form-control" rows="3" id="commentTextArea"></textarea>
                                </div>
                            </div><br/>

                        </div>
                    </Fade>
                </div>

                <div className="panel panel-danger">
                    <div className="panel-heading">
                        <h3 className="panel-title">Old Comment Author</h3>
                    </div>
                    <div className="panel-body">
                        Comment
                    </div>
                </div>
                <div className="panel panel-danger">
                    <div className="panel-heading">
                        <h3 className="panel-title">Old Comment Author</h3>
                    </div>
                    <div className="panel-body">
                        Comment
                    </div>
                </div>
                <div className="panel panel-danger">
                    <div className="panel-heading">
                        <h3 className="panel-title">Old Comment Author</h3>
                    </div>
                    <div className="panel-body">
                        Comment
                    </div>
                </div>
                <div className="panel panel-danger">
                    <div className="panel-heading">
                        <h3 className="panel-title">Old Comment Author</h3>
                    </div>
                    <div className="panel-body">
                        Comment
                    </div>
                </div>
            </div>
        );
    }
}
export default Comments;