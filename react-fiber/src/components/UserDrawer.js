import React from 'react';

//  third party libraries
import moment from 'moment';
import PropTypes from 'prop-types';

//  third party components
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import {grey400} from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {List} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

//  custom components
import ViewTask from './ViewTask';
import TaskListItem from './TaskListItem';

//  styles
import './UserDrawer.css';

//  redux
import { connect } from 'react-redux';
import * as Actions from '../actions';

class UserDrawer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isDrawerOpen: true,
            selectedTaskIndex: -1,
            tasks: [],
        };
    }

    componentDidMount() {
        this.props.setLoader(true);

        this.props.getTasks(this.props.user.id).then((res) => {
            if (res.status === 200) {
                this.setState({
                    tasks: res.data.data.tasks,
                }, () => {
                    this.props.setLoader(false);
                });
            }
        }).catch((err) => {
            this.props.setLoader(false);
            this.props.setResponseMsg(err.response.data.msg);
        });
    }

    toggleDrawer = () => {
        this.setState(prevState => ({
            isDrawerOpen: !prevState.isDrawerOpen
        }));
    }

    openViewTask = (selectedTaskIndex) => {
      this.setState({
        isDrawerOpen: false,
        selectedTaskIndex,
      });
    }

    closeViewTask = () => {
      this.setState({
        selectedTaskIndex: -1,
      }, () => {
          this.props.setDirections(null);
      });
    }

    saveTasks = (tasks) => {
        this.setState({
            tasks,
        });
    }

    markCompleted = (index) => {
        const task = this.state.tasks[index];
        this.props.editTask({id: task.id, isCompleted: true}).then((res) => {
            if (res.status === 200) {
                const tasks = this.state.tasks;
                tasks[index].isCompleted = true;

                this.setState({
                    tasks,
                }, () => {
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
            <div className="drawer-container">
                <div className="main-drawer">
                    <Drawer width="25%" open={this.state.isDrawerOpen}>
                        <div className="header">
                            <div className="user-info">
                              <div className="avatar">
                                  <Avatar src="https://www.aber.ac.uk/staff-profile-assets/img/noimg.png" />
                              </div>
                              <div className="user-name">{this.props.user.name}</div>
                            </div>

                            <IconMenu
                              iconButtonElement={
                                  <IconButton><MoreVertIcon color={grey400}/></IconButton>
                              }
                              targetOrigin={{horizontal: 'right', vertical: 'top'}}
                              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            >
                              <MenuItem primaryText="Sign out" onClick={this.props.logout} />
                            </IconMenu>
                        </div>

                        <div>
                            <List>
                                <Subheader>Tasks For Today</Subheader>
                                {
                                  this.state.tasks.map((task, index) => {
                                    if (moment().isSame(new Date(task.date), 'day')) {
                                      return (
                                        <TaskListItem
                                            key={index}
                                            index={index}
                                            task={task}
                                            openViewTask={this.openViewTask}
                                            markCompleted={this.markCompleted}
                                        />
                                      );
                                    }
                                    return null;
                                  })
                                }
                            </List>
                            <Divider />
                            <List>
                                <Subheader>Other Tasks</Subheader>
                                {
                                  this.state.tasks.map((task, index) => {
                                    if (!moment().isSame(new Date(task.date), 'day')) {
                                      return (
                                        <TaskListItem
                                            key={index}
                                            index={index}
                                            task={task}
                                            openViewTask={this.openViewTask}
                                            markCompleted={this.markCompleted}
                                        />
                                      );
                                    }
                                    return null;
                                  })
                                }
                            </List>
                        </div>

                    </Drawer>
                    <div
                        className={`toggle-drawer-btn ${this.state.isDrawerOpen && 'drawer-open'}`}
                        onClick={this.toggleDrawer}>
                        <FontIcon className="zmdi zmdi-caret-right"/>
                    </div>
                </div>

                {
                    this.state.selectedTaskIndex !== -1 &&
                    <ViewTask
                        task={this.state.tasks[this.state.selectedTaskIndex]}
                        taskIndex={this.state.selectedTaskIndex}
                        saveTasks={this.saveTasks}
                        close={this.closeViewTask}
                    />
                }

            </div>
        );
    }
}

UserDrawer.propTypes = {
    user: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    getTasks: assignedTo => dispatch(Actions.getTasks(assignedTo)),
    setLoader: loader => dispatch(Actions.setLoader(loader)),
    setResponseMsg: responseMsg => dispatch(Actions.setResponseMsg(responseMsg)),
    setDirections: directions => dispatch(Actions.setDirections(directions)),
    editTask: task => dispatch(Actions.editTask(task)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDrawer);