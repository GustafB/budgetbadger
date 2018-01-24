const db = require('../index.js');
const bcrypt = require('bcrypt');
const Promise = require('bluebird');

const User = db.Model.extend({
  tableName: 'users',
  initialize: function() {
    this.on('creating', this.hashPassword);
  },
  comparePassword: function(input, cb) {
    bcrypt.compare(input, this.get('password'), (err, match) => {
      cb(match);
    })
  },
  hashPassword: function() {
    const hasher = Promise.promisify(bcrypt.hash);
    return hasher(this.get('password'), 10).bind(this)
           .then(hash => {
              this.set('password', hash);
           })
           .catch(err => console.log(err));
  }
})