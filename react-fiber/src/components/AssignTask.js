import React from 'react';

//  third party libraries
import PropTypes from 'prop-types';

//  third party components
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

//  styles
import './AssignTask.css';

//  redux
import { connect } from 'react-redux';
import * as Actions from '../actions';

class AssignTask extends React.Component {
    constructor(props) {
        super(props);

        this.geocoder = new window.google.maps.Geocoder();
        
        this.state = {
          assginedTo: this.props.members[this.props.memberIndexForAssignTask],
          memberIndexForAssignTask: this.props.memberIndexForAssignTask,
          date: null,
          amount: 0,
          showMarkersData: false,
          markers: this.props.markers
        };
    }

    componentWillReceiveProps(newProps) {
      this.setState({
        member: newProps.member,
        markers: newProps.markers,
      });
    }

    handleMemberChange = (event, index, memberId) => {
      this.setState({
        memberIndexForAssignTask: index,
      });
    }

    handleChange = (e) => {
      const value = e.target.value;
      const key = e.target.getAttribute('data-key');
      
      this.setState({
       [key]: value,
      });
    }

    handleDateChange = (e, date) => {
      this.setState({
        date,
      });
    }

    toggleAddMarkersEnable = () => {
      if (this.props.markersLimit === 0) {
        this.props.setMarkersLimit(10);
      } else {
        this.props.setMarkersLimit(0);
      }
    }

    toggleMarkersData = () => {
      this.setState(prevState => ({
        showMarkersData: !prevState.showMarkersData,
      }));
    }

    handleAddressChange = (address, index) => {
      const markers = this.state.markers;
      markers[index].address = address;
      this.setState({
        markers,
      });
    }

    render() {
        return (
            <div className={`assign-task-container paper-container ${this.props.markersLimit > 0 && 'add-markers-enabled'}`}>
                <Paper className="assign-task-paper paper" zDepth={2}>
                    <div className="header">
                        Assign Task
                    </div>

                    <div className="assign-task-form form">
                        {
                          !this.state.showMarkersData ? 
                          <div className="other-data">
                            <div className="assigned-to">
                              <DropDownMenu
                                autoWidth={false}
                                style={{width: '100%'}}
                                value={this.props.members[this.state.memberIndexForAssignTask].id}
                                onChange={this.handleMemberChange}
                              >
                                {
                                  this.props.members.map((member) => {
                                    return (
                                      <MenuItem value={member.id} primaryText={member.name} />
                                    );
                                  })
                                }
                              </DropDownMenu>
                            </div>

                            <div className="task-date">
                              <DatePicker
                                hintText="Enter Date"
                                mode="landscape"
                                container="dialog"
                                style={{padding: '24px 24px 0px 24px'}}
                                textFieldStyle={{width: '100%'}}
                                value={this.state.date}
                                onChange={this.handleDateChange}
                              />
                            </div>

                            <div className="amount input-field">
                                <TextField
                                  type="text"
                                  fullWidth
                                  floatingLabelText="Amount"
                                  data-key="amount"
                                  value={this.state.amount}
                                  onChange={this.handleChange}
                                />
                            </div>
                          </div> :
                          <div className="markers-data">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHeaderColumn style={{width: '30px'}}>Lable</TableHeaderColumn>
                                  <TableHeaderColumn>Location</TableHeaderColumn>
                                  <TableHeaderColumn>Address</TableHeaderColumn>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {
                                  this.state.markers.map((marker, index) => {
                                    return (
                                      <TableRow>
                                        <TableRowColumn style={{width: '30px'}}>{marker.label}</TableRowColumn>
                                        <TableRowColumn>{marker.place}</TableRowColumn>
                                        <TableRowColumn>
                                          <div className="address-field">
                                              <TextField
                                                type="text"
                                                fullWidth
                                                inputStyle={{fontSize: '13px'}}
                                                value={marker.address}
                                                onChange={(e) => this.handleAddressChange(e.target.value, index)}
                                              />
                                          </div>
                                        </TableRowColumn>
                                      </TableRow>
                                    );
                                  })
                                }
                              </TableBody>
                            </Table>
                          </div>
                        }
                    </div>
                    <div className="actions">
                        
                        <div className="actions-left">
                          <FlatButton label="Add Markers" primary onClick={() => this.toggleAddMarkersEnable()} />
                          {
                            this.props.markers.length > 0 &&
                            <IconButton
                              className="next-prev"
                              onClick={this.toggleMarkersData}
                              iconClassName={`zmdi zmdi-chevron-${this.state.showMarkersData ? 'left' : 'right'}`}
                            />
                          }
                        </div>
                        <div className="action-right">
                          <FlatButton label="Close" labelStyle={{ color: 'red' }} onClick={this.props.close} />
                          <FlatButton label="Assign" primary onClick={() => this.props.assign({
                            assignedTo: this.state.assginedTo,
                            date: this.state.date,
                            markers: JSON.stringify(this.state.markers),
                            amount: this.state.amount,
                          })} />
                        </div>
                    </div>
                    {
                      this.props.markersLimit > 0 &&
                      <div
                          className="toggle-add-markers-enable-btn"
                          onClick={this.toggleAddMarkersEnable}>
                          <FontIcon className="zmdi zmdi-caret-left"/>
                      </div>
                    }
                </Paper>
            </div>
        );
    }
}

AssignTask.propTypes = {
  memberIndexForAssignTask: PropTypes.number.isRequired,
  members: PropTypes.array.isRequired,
  close: PropTypes.func.isRequired,
  assign: PropTypes.func.isRequired,
  setMarkersLimit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  markersLimit: state.markersLimit,
  markers: state.markers,
});

const mapDispatchToProps = (dispatch) => ({
  setMarkersLimit: markersLimit => dispatch(Actions.setMarkersLimit(markersLimit)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssignTask);