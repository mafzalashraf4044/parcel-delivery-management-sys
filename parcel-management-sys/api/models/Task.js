/**
 * Users.js
 *
 * @description :: File Contains Structure of Users Collection & Methods for CRUD Operations.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    assignedTo: {
      model: 'user',
      required: true,
    },
    
    date: {
      type: 'date',
      required: true,
    },

    amount: {
      type: 'float',
      required: true,
    },

    markers: {
      type: 'json',
      required: true,
    },

    isCompleted: {
      type: 'boolean',
      defaultsTo: false
    },

    isArchived: {
      type: 'boolean',
      defaultsTo: false
    },

  }
};

