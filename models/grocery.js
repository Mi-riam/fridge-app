'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grocery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Grocery.hasMany(models.FridgeItem, {
        foreignKey: 'groceryId',
        as: 'fridgeItems',
      });

      Grocery.hasMany(models.WishlistItem, {
        foreignKey: 'groceryId',
        as: 'wishlistItems',
      });
    }
  }
  Grocery.init(
    {
      name: DataTypes.STRING,
      expirationTime: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'Grocery',
    }
  );
  return Grocery;
};
