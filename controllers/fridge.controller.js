const { FridgeItem, Grocery } = require('../models/index.js');
const { Op } = require('sequelize');

async function getFridgePage(req, res) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;

  try {
    // Find the user with the specified ID and include their associated fridge items and the grocery information
    const fridgeItems = await FridgeItem.findAll({
      where: { userId },
      include: {
        model: Grocery,
        as: 'grocery',
      },
    });

    // Send user and the groceries in the user's fridge
    res.render('fridge', {
      user: req.session.user,
      fridgeItems: fridgeItems.map((item) => ({
        ...item,
        amount: item.amount,
        expirationInfo: formatExpirationTime(
          item.updatedAt,
          item.grocery.expirationTime
        ),
      })),
    });
  } catch (error) {
    // Handle the error appropriately
    console.error('Error fetching groceries in fridge:', error);
    res.render('fridge', { error: 'Internal server error' });
  }
}

async function createFridgeItem(req, res) {
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

    // Find or create the fridge item and associate it with the user and grocery
    const [fridgeItem, created] = await FridgeItem.findOrCreate({
      where: { groceryId: grocery.id, userId },
      defaults: { amount, userId, groceryId: grocery.id },
    });

    if (!created) {
      // If fridge item exists don't create a new one instead update item in db
      await FridgeItem.update(
        {
          amount,
        },
        { where: { id: fridgeItem.id } }
      );
    }

    // Associate the grocery with the fridge item
    await fridgeItem.setGrocery(grocery);

    res.redirect('/fridge');
  } catch (error) {
    // Handle the error appropriately
    console.error('Error creating fridge item:', error);
    throw error;
  }
}

async function deleteFridgeItem(req, res) {
  const itemId = req.params.itemId;

  try {
    const deletedRows = await FridgeItem.destroy({ where: { id: itemId } });

    if (deletedRows === 0) {
      throw new Error('Fridge item not found');
    }

    res.redirect('/fridge');
  } catch (error) {
    console.error('Error deleting fridge item:', error);
    throw error;
  }
}

function formatExpirationTime(updatedAt, expirationTime) {
  const expirationDate = new Date(
    updatedAt.getTime() + expirationTime * 24 * 60 * 60 * 1000
  );
  const differenceInDays = Math.ceil(
    (expirationDate - Date.now()) / (24 * 60 * 60 * 1000)
  );

  const result = {
    message: '',
    style: '',
  };

  if (differenceInDays >= 1) {
    result.message = `Expiration days: ${differenceInDays}`;
    if (differenceInDays <= 3) {
      result.style = 'color: red;';
    }
  } else {
    result.message = 'The grocery is expired!';
    result.style = 'color: red;';
  }

  return result;
}

module.exports = {
  getFridgePage,
  createFridgeItem,
  deleteFridgeItem,
};
