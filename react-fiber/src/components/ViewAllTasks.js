import React from 'react';

//  third party libraries
import moment from 'moment';
import PropTypes from 'prop-types';

//  third party components
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

//  styles
import './ViewAllTasks.css';

//  redux
import { connect } from 'react-redux';
import * as Actions from '../actions';

class ViewAllTasks extends React.Component {
    constructor(props) {
        super(props);

        this.geocoder = new window.google.maps.Geocoder();
        
        this.state = {
          tasks: [],
        };
    }

    componentDidMount() {
      this.props.setLoader(true);

      this.props.getTasks(this.props.member.id).then((res) => {
        if (res.status === 200) {
          this.setState({
            tasks: res.data.data.tasks,
          } , () => {
            this.props.setLoader(false);
          });
        }
      }).catch((err) => {
        this.props.setLoader(false);
        this.props.setResponseMsg(err.response.data.msg);
      });
    }

    render() {
        return (
            <div className="view-tasks-container paper-container">
                <Paper className="view-tasks-paper paper" zDepth={2}>
                    <div className="header">
                        All Tasks
                    </div>

                    <div className="view-tasks-form form">
                      <div className="markers-data">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHeaderColumn>Date</TableHeaderColumn>
                              <TableHeaderColumn>Amount</TableHeaderColumn>
                              <TableHeaderColumn>Status</TableHeaderColumn>
                              <TableHeaderColumn>Total Deliveries</TableHeaderColumn>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {
                              this.state.tasks.map((task, index) => {
                                return (
                                  <TableRow>
                                    <TableRowColumn>{moment(task.date).format('YYYY-MM-DD')}</TableRowColumn>
                                    <TableRowColumn>{task.amount}</TableRowColumn>
                                    <TableRowColumn>{task.isCompleted ? 'Completed' : 'Not Completed'}</TableRowColumn>
                                    <TableRowColumn>{task.markers.length}</TableRowColumn>
                                  </TableRow>
                                );
                              })
                            }
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    <div className="actions">
                      <FlatButton label="Close" labelStyle={{ color: 'red' }} onClick={() => this.props.close(-1)} />
                    </div>
                </Paper>
            </div>
        );
    }
}

ViewAllTasks.propTypes = {
  member: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  getTasks: memberId => dispatch(Actions.getTasks(memberId)),
  setLoader: loader => dispatch(Actions.setLoader(loader)),
  setResponseMsg: responseMsg => dispatch(Actions.setResponseMsg(responseMsg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllTasks);