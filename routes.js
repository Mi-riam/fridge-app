const express = require('express');
const homeController = require('./controllers/home.controller.js');
const registerController = require('./controllers/register.controller.js');
const loginController = require('./controllers/login.controller.js');
const fridgeController = require('./controllers/fridge.controller.js');
const wishlistController = require('./controllers/wishlist.controller.js');
const shoppingListController = require('./controllers/shopping-list.controller.js');

const router = express.Router();

// Home
router.get('/', homeController.getHomePage);

// Register
router.get('/register', registerController.getRegisterPage);
router.post('/register', registerController.registerUser);

// Login
router.get('/login', loginController.getLoginPage);
router.post('/login', loginController.logInUser);
router.get('/login/logout', loginController.logoutUser);
router.get('/logout', loginController.getLogoutPage);

// Fridge
router.get('/fridge', fridgeController.getFridgePage);
router.post('/fridge', fridgeController.createFridgeItem);
router.get('/fridge/delete/:itemId', fridgeController.deleteFridgeItem);

// Wishlist
router.get('/wishlist', wishlistController.getWishlistPage);
router.post('/wishlist', wishlistController.createWishlistItem);
router.get('/wishlist/delete/:itemId', wishlistController.deleteWishlistItem);

// Shopping List
router.get('/shopping-list', shoppingListController.generateShoppingList);

module.exports = router;
