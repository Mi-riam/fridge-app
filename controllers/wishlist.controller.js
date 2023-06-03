const { WishlistItem, Grocery } = require('../models/index.js');
const { Op } = require('sequelize');

async function getWishlistPage(req, res) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;

  try {
    // Find the user with the specified ID and include their associated wishlist items and the grocery information
    const wishlistItems = await WishlistItem.findAll({
      where: { userId },
      include: {
        model: Grocery,
        as: 'grocery',
      },
    });

    // Send user and the groceries in the user's wishlist
    res.render('wishlist', {
      user: req.session.user,
      wishlistItems,
    });
  } catch (error) {
    // Handle the error appropriately
    console.error('Error fetching groceries in wishlist:', error);
    res.render('wishlist', { error: 'Internal server error' });
  }
}

async function createWishlistItem(req, res) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;
  const itemName = req.body.itemName;
  const amount = req.body.amount;

  try {
    // Find or create the grocery with the specified name
    const [grocery] = await Grocery.findOrCreate({
      where: {
        name: { [Op.like]: itemName },
      },
      defaults: {
        name: itemName,
        expirationTime: 10,
      },
    });

    // Find or create the wishlist item and associate it with the user and grocery
    const [wishlistItem, created] = await WishlistItem.findOrCreate({
      where: { groceryId: grocery.id, userId },
      defaults: { amount, userId, groceryId: grocery.id },
    });

    if (!created) {
      // If wishlist item exists don't create a new one instead update item in db
      await WishlistItem.update(
        {
          amount,
        },
        { where: { id: wishlistItem.id } }
      );
    }

    // Associate the grocery with the wishlist item
    await wishlistItem.setGrocery(grocery);

    // Find the user with the specified ID and include their associated wishlist items and the grocery information
    const wishlistItems = await WishlistItem.findAll({
      where: { userId },
      include: {
        model: Grocery,
        as: 'grocery',
      },
    });

    res.render('wishlist', {
      user: req.session.user,
      wishlistItems,
    });
  } catch (error) {
    // Handle the error appropriately
    console.error('Error creating wishlist item:', error);
    throw error;
  }
}

async function deleteWishlistItem(req, res) {
  const itemId = req.params.itemId;

  try {
    const deletedRows = await WishlistItem.destroy({ where: { id: itemId } });

    if (deletedRows === 0) {
      throw new Error('wishlist item not found');
    }

    res.redirect('/wishlist');
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    throw error;
  }
}

module.exports = {
  getWishlistPage,
  createWishlistItem,
  deleteWishlistItem,
};
