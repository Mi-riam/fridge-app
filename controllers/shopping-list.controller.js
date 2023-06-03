const { FridgeItem, WishlistItem, Grocery } = require('../models/index.js');
const { Op } = require('sequelize');

async function generateShoppingList(req, res) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;

  try {
    // Get the user's fridge items and wishlist items
    const fridgeItems = await FridgeItem.findAll({
      where: { userId },
      include: {
        model: Grocery,
        as: 'grocery', // Specify the alias for the association
      },
    });
    const wishlistItems = await WishlistItem.findAll({
      where: { userId },
      include: {
        model: Grocery,
        as: 'grocery', // Specify the alias for the association
      },
    });

    // Generate the shopping list based on the fridge items and wishlist items
    const shoppingList = [];

    // Iterate over the wishlist items
    for (const wishlistItem of wishlistItems) {
      const { groceryId, amount: wishlistAmount } = wishlistItem;

      // Find the corresponding fridge item for the grocery
      const fridgeItem = fridgeItems.find(
        (item) => item.groceryId === groceryId
      );

      // If the fridge item exists and the amount is less than the wishlist amount,
      // calculate the quantity needed to be added to the shopping list
      if (fridgeItem && fridgeItem.amount < wishlistAmount) {
        const quantityToAdd = wishlistAmount - fridgeItem.amount;

        // Add the grocery name and the quantity to the shopping list
        const shoppingListItem = {
          groceryName: fridgeItem.grocery.name,
          quantity: quantityToAdd,
        };

        shoppingList.push(shoppingListItem);
      }
    }

    // Render the shopping list view
    res.render('shopping-list', {
      user: req.session.user,
      shoppingList,
    });
  } catch (error) {
    // Handle the error appropriately
    console.error('Error generating shopping list:', error);
    res.render('shopping-list', { error: 'Internal server error' });
  }
}

module.exports = {
  generateShoppingList,
};
