import React from 'react';

//  third party libraries
import PropTypes from 'prop-types';

//  third party components
import Avatar from 'material-ui/Avatar';
import {ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import {grey400} from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class MemberListItem extends React.Component {

  render(){

    const iconButtonElement = (
      <IconButton
        touch={true}
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
    );

  const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onClick={() => this.props.openAssignTask(this.props.index)}>Assign Task</MenuItem>
        <MenuItem onClick={() => this.props.toggleViewAllTasks(this.props.index)}>All Tasks</MenuItem>
        <MenuItem onClick={() => this.props.deleteMember(this.props.member.id, this.props.index)}>Delete</MenuItem>
      </IconMenu>
    );

    return (
      <ListItem
        primaryText={this.props.member.name}
        leftAvatar={<Avatar src="https://www.aber.ac.uk/staff-profile-assets/img/noimg.png" />}
        rightIconButton={rightIconMenu}
        onClick={() => this.props.openEditMember(this.props.index)}
    />
    );
  }
}

MemberListItem.propTyeps = {
  member: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  openAssignTask: PropTypes.func.isRequired,
  openEditMember: PropTypes.func.isRequired,
  deleteMember: PropTypes.func.isRequired,
  toggleViewAllTasks: PropTypes.func.isRequired,
};

export default MemberListItem;