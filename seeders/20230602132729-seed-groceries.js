'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Groceries', [
      {
        name: 'Apple',
        expirationTime: 15, // Assuming 1 hour expiration time in seconds
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Banana',
        expirationTime: 10, // Assuming 2 hours expiration time in seconds
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more grocery items as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Groceries', null, {});
  },
};
