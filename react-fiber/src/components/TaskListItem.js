import React from 'react';

//  third party libraries
import PropTypes from 'prop-types';

//  third party components
import {ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import {grey400} from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class TaskListItem extends React.Component {

  render() {

    const iconButtonElement = (
      <IconButton
        touch={true}
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
    );

  const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem
          disabled={this.props.tasks && this.props.tasks[this.props.index].isCompleted}
          onClick={()=>this.props.markCompleted(this.props.index)}
        >Mark Completed</MenuItem>
      </IconMenu>
    );

    return (
      <ListItem
        primaryText={`Task ${this.props.index + 1}`}
        leftIcon={<FontIcon className="zmdi zmdi-assignment-o"/>}
        rightIconButton={rightIconMenu}
        onClick={() => this.props.openViewTask(this.props.index)}
    />
    );
  }
}

TaskListItem.propTyeps = {
  tasks: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  openViewTask: PropTypes.func.isRequired,
  markCompleted: PropTypes.func.isRequired,
};

export default TaskListItem;