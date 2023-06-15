const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  administrator: {
    type: Boolean,
    required: true
  }
},
{
    timestamps: true
}
);

const User = mongoose.model('User', UserSchema);


User.findOne({ username: 'admin' }, function(err, user) {
    if (err) throw err;
  
    if (!user) {
      var newUser = new User({
        username: 'admin',
        email: 'admin',
        administrator:true,
        password: '$2b$12$DBNzQUjFUcRlthaJagugD.nthMJ/wgegM3d0Bi4vcRlz95RBVFI4W'
      });
  
      newUser.save(function(err) {
        if (err) throw err;
        console.log('Default user created!');
      });
    }
  });
module.exports = User;