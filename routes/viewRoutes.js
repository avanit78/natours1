const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.get('/',bookingController.createBookingCheckout,authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/resetPassword', authController.isLoggedIn, viewsController.getResetPasswordForm);
router.get('/signup', viewsController.getSignUpForm);
router.get('/me',authController.protect,viewsController.getAccount);
router.get('/my-tours',authController.protect,viewsController.getMyTours);
router.get('/my-reviews',authController.protect,viewsController.getMyReviews);
router.get('/my-tours/:slug',authController.protect,viewsController.getReviewTour);
router.get('/allBookedTour',authController.protect,authController.restrictTo('admin'), viewsController.getAllBookedTour);
router.get('/allTourReview',authController.protect,authController.restrictTo('admin'), viewsController.getAllTourReview);
router.get('/allUser',authController.protect,authController.restrictTo('admin'), viewsController.getAllUser);
router.get('/allTour',authController.protect,authController.restrictTo('admin'), viewsController.getAllTour);
router.get('/reports',authController.protect,authController.restrictTo('admin'), viewsController.reports);
router.get('/viewreports',authController.protect,authController.restrictTo('admin'), viewsController.viewreports);
// router.get('/submit-user-data',authController.protect,viewsController.updateUserData);

module.exports = router;