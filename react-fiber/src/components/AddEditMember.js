import React from 'react';

//  third party libraries
import PropTypes from 'prop-types';

//  third party components
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

//  styles
import './AddEditMember.css';

class AddEditMember extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          member: this.props.member,
        };
    }

    componentWillReceiveProps(newProps) {
      this.setState({
        member: newProps.member,
      });
    }

    handleChange = (e) => {
      const member = this.state.member;
      member[e.target.getAttribute('data-key')] = e.target.value;
      
      this.setState({
        member,
      });
    }

    render() {
        const {member} = this.state;
        
        return (
            <div className="add-edit-member-container paper-container">
                <Paper className="add-edit-member-paper paper" zDepth={2}>
                    <div className="header">
                        Member
                    </div>

                    <div className="add-edit-member-form form">
                        <div className="name input-field">
                            <TextField
                              type="text"
                              fullWidth
                              floatingLabelText="Name"
                              data-key="name"
                              value={member.name}
                              onChange={this.handleChange}
                            />
                        </div>

                        <div className="username input-field">
                            <TextField
                              type="text"
                              fullWidth
                              floatingLabelText="Username"
                              data-key="username"
                              value={member.username}
                              onChange={this.handleChange}
                            />
                        </div>

                        {
                            this.props.isAddMember &&
                            <div className="password input-field">
                                <TextField
                                  type="password"
                                  fullWidth
                                  floatingLabelText="Password"
                                  data-key="password"
                                  value={member.password}
                                  onChange={this.handleChange}
                                />
                            </div>
                        }

                        <div className="phoneNumber input-field">
                            <TextField
                              type="text"
                              fullWidth
                              floatingLabelText="Phone Number"
                              data-key="phoneNumber"
                              value={member.phoneNumber}
                              onChange={this.handleChange}
                            />
                        </div>

                        <div className="email input-field">
                            <TextField
                              type="text"
                              fullWidth
                              floatingLabelText="Email"
                              data-key="email"
                              value={member.email}
                              onChange={this.handleChange}
                            />
                        </div>

                        <div className="address input-field">
                            <TextField
                              type="text"
                              fullWidth
                              floatingLabelText="Address"
                              data-key="address"
                              value={member.address}
                              onChange={this.handleChange}
                            />
                        </div>


                        <div className="vehicleType input-field">
                            <TextField
                              type="text"
                              fullWidth
                              floatingLabelText="Vehicle Type"
                              data-key="vehicleType"
                              value={member.vehicleType}
                              onChange={this.handleChange}
                            />
                        </div>
                        {
                            !this.props.isAddMember &&
                            <div className="tasksCompleted input-field">
                                <TextField
                                type="text"
                                fullWidth
                                floatingLabelText="Tasks Completed"
                                data-key="tasksCompleted"
                                value={member.tasksCompleted}
                                />
                            </div>
                        }

                    </div>
                    <div className="actions">
                        <FlatButton label="Close" labelStyle={{ color: 'red' }} onClick={this.props.close} />
                        {
                            this.props.isAddMember ?
                            <FlatButton label="Add" primary={true} onClick={() => this.props.add(member)} /> :
                            <FlatButton label="Save" primary={true} onClick={() => this.props.edit(member)} />
                        }
                    </div>

                </Paper>
            </div>
        );
    }
}

AddEditMember.propTypes = {
  member: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  isAddMember: PropTypes.bool.isRequired,
};

export default AddEditMember;