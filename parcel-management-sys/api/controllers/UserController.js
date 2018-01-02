/**
 * UserController
 *
 * @description :: Server-side logic for managing user
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const passwordHash = require('password-hash');

module.exports = {

  login: (req, res) => {
    let params = req.allParams();

    if (!(params.username && params.password)) {
      return res.json(400, {msg: 'No username or password specified!'});
    }

    User.findOne({username: params.username}).exec(function (err, user) {
      if(err){
          sails.log('UserController::login ERROR', err);
          return res.serverError();
      }

      if (!user) {
        return res.json(404, {
          msg: 'Invalid username and/or password!',
        });
      } else if(!passwordHash.verify(params.password, user.password)) {
          return res.json(404, {
            msg: 'Invalid username and/or password!',
          });
      } else {

        req.session.authenticated = user.id;
        
        return res.json(200, {
          data: {
            msg: 'Login Successful!',
            user: user,
          }
        });
      }

    });
  },

  logout: (req, res) => {
    req.session.authenticated = null;
    return res.ok('Logout successful!');
  },

  isLoggedIn: (req, res) => {
    sails.log('req.session.authenticated', req.session.authenticated);
    if (req.session.authenticated) {
      return res.ok('Login!');
    } else {
      return res.ok('Logout!');
    }
  },

  getMembers: (req, res) => {

    User.find({isArchived: false, isAdmin: false}).exec((err, members) => {
      if(err){
          sails.log('UserController::getMembers ERROR', err);
          return res.serverError();
      }

      return res.json(200, {
        data: {
          msg: 'Members fetched successfully',
          members: members
        }
      });

    });

  },

  addMember: (req, res) => {

    let params = req.allParams();

    if (!params.name || !params.email || !params.password) {
      return res.json(400, {msg: 'Required parameters are missing!'});
    }

    var hashedPassword = passwordHash.generate(params.password);

    User.findOne({email: params.email}).exec(function (err, memberExist) {
      if(err){
          sails.log('UserController::addMember ERROR', err);
          return res.serverError();
      }

      if (!memberExist) {
        User.create(Object.assign(params, {password: hashedPassword})).exec(function (err, member) {
          if(err){
              sails.log('UserController::addMember ERROR', err);
              return res.serverError();
          }
      
          return res.json(200, {
            data: {
              msg: 'New member created successfully!',
              member: member
            }
          });
    
        });
      } else {
        return res.json(400, {msg: 'Member with this email address already exist!'});
      }

    });



  },

  editMember: (req, res) => {

    let params = req.allParams();

    if(!params.id || !params.name || !params.email){
      return res.json(400, {msg: 'Required parameters are missing!'});
    }

    User.findOne({id: params.id, isArchived: false}).exec(function (err, member) {
      if(err){
          sails.log('UserController::editMember ERROR', err);
          return res.serverError();
      }

      if (!member) {
        return res.json(404, {msg: 'Member does not exist!'});
      }

      member.name = params.name;
      member.email = params.email;
      member.username = params.username;
      member.phoneNumber = params.phoneNumber;
      member.address = params.address;
      member.vehicleType = params.vehicleType;

      member.save((err) => {
        if(err){
          sails.log('UserController::editMember ERROR', err);
            return res.serverError();
        }

        return res.json(200, {
          data: {
            msg: 'Member updated successfully!',
            member: member
          }
        });

      });

    });

  },

  dltMember: (req, res) => {

    let params = req.allParams();

    if(!params.id){
      return res.json(400, {msg: 'Required parameters are missing!'});
    }

    User.findOne({id: params.id, isArchived: false}).exec(function (err, member) {
      if(err){
          sails.log('UserController::dltMember ERROR', err);
          return res.serverError();
      }

      if (!member) {
        return res.json(404, {msg: 'Member does not exist!'});
      }

      member.isArchived = true;

      member.save((err) => {
        if(err){
          sails.log('UserController::dltMember ERROR', err);
            return res.serverError();
        }

        return res.json(200, {
          data: {
            msg: 'Member deleted successfully!'
          }
        });

      });

    });

  },

}