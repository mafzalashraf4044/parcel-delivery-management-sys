/**
 * Users.js
 *
 * @description :: File Contains Structure of Users Collection & Methods for CRUD Operations.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true
    },
    
    username: {
      type: 'string',
    },

    email: {
      type: 'string',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    },

    phoneNumber: {
      type: 'string',
    },

    address: {
      type: 'string',
    },

    vehicleType: {
      type: 'string',
    },

    tasksCompleted: {
      type: 'integer',
      defaultsTo: 0,
    },

    totalEarning: {
      type: 'float',
      defaultsTo: '0',
    },

    isAdmin: {
      type: 'boolean',
      defaultsTo: false,
    },

    tasks: {
      collection: 'task',
      via: 'assignedTo'
    },

    isArchived: {
      type: 'boolean',
      defaultsTo: false
    },

    // Override toJSON instance method to remove password value
    toJSON: function() {
      let obj = this.toObject();
      delete obj.password;
      return obj;
    }
  }
};

