'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WishlistItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WishlistItem.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      WishlistItem.belongsTo(models.Grocery, {
        foreignKey: 'groceryId',
        as: 'grocery',
      });
    }
  }
  WishlistItem.init(
    {
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'WishlistItem',
    }
  );
  return WishlistItem;
};
