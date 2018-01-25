const knex = require('knex')({
  client: 'pg',
  connection: {
    user: process.env.DB_USER,
    database: 'bbadger',
    charset: 'utf8',
  }
});

knex.schema.hasTable('users').then(exists => {
  if (!exists) {
    knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('email');
      table.string('password');
    }).then(() => console.log('created table users'))
  }
})

knex.schema.hasTable('transactions').then(exists => {
  if (!exists) {
    knex.schema.createTable('transactions', table => {
      table.increments('id').primary();
      table.string('amount');
      table.string('category');
      table.integer('userid');
    }).then(() => console.log('created table transactions'))
  }
})

const db = require('bookshelf')(knex);

module.exports = { db, knex };