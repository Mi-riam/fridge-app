'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('WishlistItems', [
      {
        amount: 3,
        userId: 1,
        groceryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        amount: 5,
        userId: 1,
        groceryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more wishlist items as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('WishlistItems', null, {});
  },
};
