import mongoose from 'mongoose';
import User from '../models/user.model.js';

var user = {};

user.setUserOnline = function (id, callback) {
    User.findByIdAndUpdate(id, { status: "online" }, { new: true }, function (err, user) {
        if (err) {
            console.error(err);
            callback(null, err);
        } else {
            callback(user);
        }
    });
};

user.setUserOffline = function (id, callback) {
    User.findByIdAndUpdate(id, { status: "offline" }, { new: true }, function (err, user) {
        if (err) {
            console.error(err);
            callback(null, err);
        } else {
            callback(user);
        }
    });
};

export default user;
