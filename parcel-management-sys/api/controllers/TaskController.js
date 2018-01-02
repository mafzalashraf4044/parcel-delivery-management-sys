/**
 * TaskController
 *
 * @description :: Server-side logic for managing Task
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBJ_N-FztvixVMGM_dxBShcgySNowB3XTM'
});

module.exports = {

  getTasks: (req, res) => {

    let params = req.allParams();

    Task.find({isArchived: false, assignedTo: params.assignedTo}).exec((err, tasks) => {
      if(err){
          sails.log('TaskController::getTasks ERROR', err);
          return res.serverError();
      }

      return res.json(200, {
        data: {
          msg: 'Tasks fetched successfully!',
          tasks: tasks,
        }
      });

    });

  },

  addTask: (req, res) => {

    let params = req.allParams();

    if (!params.assignedTo || !params.date || !params.amount || !params.markers) {
      return res.json(400, {msg: 'Required parameters are missing!'});
    }

    Task.create(params).exec(function (err, task) {
      if(err){
          sails.log('TaskController::addTask ERROR', err);
          return res.serverError();
      }
  
      return res.json(200, {
        data: {
          msg: 'New task created successfully!',
          task: task,
        }
      });

    });

  },

  editTask: (req, res) => {

    let params = req.allParams();

    if(!params.assignedTo && !params.date && !params.amount && !params.isCompleted){
      return res.json(400, {msg: 'Required parameters are missing!'});
    }

    Task.findOne({id: params.id}).exec(function (err, task) {
      if(err){
          sails.log('TaskController::editTask ERROR', err);
          return res.serverError();
      }

      if (!task) {
        return res.json(404, {msg: 'Task does not exist!'});
      }

      if (params.assignedTo) task.assignedTo = params.assignedTo;
      if (params.date) task.date = params.date;
      if (params.amount) task.amount = params.amount;
      if (params.isCompleted) task.isCompleted = params.isCompleted;

      task.save((err) => {
        if(err){
          sails.log('TaskController::editTask ERROR', err);
            return res.serverError();
        }

        return res.json(200, {
          data: {
            msg: 'Task updated successfully!',
            task: task
          }
        });

      });

    });

  },

  dltTask: (req, res) => {

    let params = req.allParams();

    if(!params.id){
      return res.json(400, {msg: 'required parameters are missing'});
    }

    Task.findOne({id: params.id}).exec(function (err, task) {
      if(err){
          sails.log('TaskController::dltTask ERROR', err);
          return res.serverError();
      }

      if (!task) {
        return res.json(404, {msg: 'Task does not exist!'});
      }

      task.isArchived = true;

      task.save((err) => {
        if(err){
          sails.log('TaskController::dltTask ERROR', err);
            return res.serverError();
        }

        return res.json(200, {
          data: {
            msg: 'Task deleted successfully!'
          }
        });

      });

    });

  },

  getMinimumDistances: (req, res) => {
    const params = req.allParams();
    const markers = params.markers;
    const markersAsOrigin = [];

    markers.forEach((origin, index) => {
      const _markers = _.clone(markers);
      _markers.splice(index, 1)

      markersAsOrigin.push([]);

      _markers.forEach((destination, i) => {
        googleMapsClient.distanceMatrix({
          origins: [origin.location],
          destinations: [destination.location],
        }, callback);
    
        function callback(error, response) {

          if(error) {
            return res.json(400, {
              data: {
                msg: 'System busy, please try again later!',
              }
            });
          }

          sails.log('response', response);

          markersAsOrigin[index].push({
            label: destination.label,
            location: destination.location,
            address: destination.address,
            distance: response.json.rows[0].elements[0].distance.value,
          });

          if (markersAsOrigin.reduce((sum, arr) => sum + arr.length, 0) === markers.length * (markers.length - 1)) {
            sails.log('return response');
            return res.json(200, {
              data: {
                msg: 'Distances calculated successfully!',
                markersAsOrigin: markersAsOrigin,
              }
            });
          }
        }
      });
    });
  }

}