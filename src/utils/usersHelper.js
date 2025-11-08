import User from '../models/user.model.js';

const user = {};

user.setUserOnline = function (id, callback) {
  User.findByIdAndUpdate(id, { status: 'online' }, { new: true }, (err, updatedUser) => {
    if (err) {
      callback(null, err);
    } else {
      callback(updatedUser);
    }
  });
};

user.setUserOffline = function (id, callback) {
  User.findByIdAndUpdate(id, { status: 'offline' }, { new: true }, (err, updatedUser) => {
    if (err) {
      callback(null, err);
    } else {
      callback(updatedUser);
    }
  });
};

export default user;
