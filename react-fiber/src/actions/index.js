import axios from 'axios';

export const setLoader = (loader) => {
  return {
    type: 'SET_LOADER',
    payload: {
      loader,
    },
  };
};

export const setResponseMsg = (responseMsg) => {
  return {
    type: 'SET_RESPONSE_MSG',
    payload: {
      responseMsg,
    },
  };
};

export const saveMarkers = (markers) => {
    return {
      type: 'SAVE_MARKERS',
      payload: {
        markers,
      },
    };
};

export const saveTasks = (tasks) => {
  return {
    type: 'SAVE_TASKS',
    payload: {
      tasks,
    },
  };
};

export const setMarkersLimit = (markersLimit) => {
  return {
    type: 'SET_MARKERS_LIMIT',
    payload: {
      markersLimit,
    },
  };
};

export const setDirections = (directions) => {
  return {
    type: 'SET_DIRECTIONS',
    payload: {
      directions,
    },
  };
};

export const login = (credentials) => {
  return (dispatch) => {
      return axios.post('http://localhost:1337/login', credentials);
  }
}

export const getMembers = () => {
  return (dispatch) => {
      return axios.get('http://localhost:1337/members');
  }
}

export const addMember = (member) => {
  return (dispatch) => {
      return axios.post('http://localhost:1337/members', member);
  }
}

export const editMember = (member, index) => {
  return (dispatch) => {
      return axios.put('http://localhost:1337/members/', member);
  }
}

export const deleteMember = (memberId) => {
  return (dispatch) => {
      return axios.delete(`http://localhost:1337/members/${memberId}`);
  }
}

export const getTasks = (assignedTo) => {
  return (dispatch) => {
      return axios.get(`http://localhost:1337/tasks?assignedTo=${assignedTo}`);
  }
}

export const addTask = (task) => {
  return (dispatch) => {
      return axios.post('http://localhost:1337/tasks', task);
  }
}

export const editTask = (task, index) => {
  return (dispatch) => {
      return axios.put('http://localhost:1337/tasks/', task);
  }
}

export const deleteTask = (taskId) => {
  return (dispatch) => {
      return axios.delete(`http://localhost:1337/tasks/${taskId}`);
  }
}

export const getMinDistance = (markers) => {
  return (dispatch) => {
      return axios.post('http://localhost:1337/mindistance', markers);
  }
}