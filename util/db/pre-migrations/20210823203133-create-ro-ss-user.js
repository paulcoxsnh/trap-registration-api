'use strict';

// The pre-migrations only make sense when running inside the production docker
// environment. They are not required for the development SQLite DB.
if (process.env.NODE_ENV === 'production') {
  // Even though this is a 'pre-migrations' migration, we need to import the
  // production config as we're setting the password the production account will
  // use.
  const config = require('../../../src/config/database.js').ssDatabase;

  module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.query(
        'create role rotraps with noinherit login password :roTrapsPassword;',
        {
          type: Sequelize.QueryTypes.RAW,
          replacements: {
            roTrapsPassword: config.password
          }
        }
      );
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.query('drop role rotraps;', {
        type: Sequelize.QueryTypes.RAW
      });
    }
  };
} else {
  module.exports = {
    up: () => {
      return Promise.resolve();
    },
    down: () => {
      return Promise.resolve();
    }
  };
}
