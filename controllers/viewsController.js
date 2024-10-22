const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('./../models/BookingModel');
const Review = require('./../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getOverview = catchAsync(async (req,res,next)=>{
    //1) Get tour data from colection
    const tours = await Tour.find();

    //2) Build template
    //3) Render that template using tour data from 1)
    res.status(200).render('overview',{
        title: 'All Tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    // 1) Get data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!tour) {
        return next(new AppError('No tour found with that Name', 404));
    }

    // 2) Find bookings if user is logged in
    let bookings = [];
    let tourBooked = [];
    if (req.user && req.user.id) {
        bookings = await Booking.find({
            user: req.user.id
        });
        tourBooked = await Booking.find({
            tour: tour.id
        });
    }
    // 3) Render template using data from 1) and 2)
    res.status(200).render('tour', {
        title: `${tour.name} tour`,
        tour,
        bookings,
        tourBooked
    });
});

exports.getAllTourReview = catchAsync(async (req, res, next) => {
    // 1) Get data, for the requested tour (including reviews and guides)
    const tours = await Tour.find().populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!tours) {
        return next(new AppError('No tour found with that Name', 404));
    }
    // 3) Render template using data from 1) and 2)
    res.status(200).render('allTourReview', {
        title: `All Tour Review`,
        tours
    });
});

exports.getReviewTour = catchAsync(async(req,res,next)=>{
    //1) Get data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    })

    if(!tour){
        return next(new AppError('No tour found with that Name',404))
    }
    //2) Build Template
    //3) Render template using data from 1)
    // console.log(tour);
    res.status(200).render('review',{
        title: `review on ${tour.name} tour`,
        tour
    });
});

exports.getLoginForm = (req,res)=>{
    res.status(200).render('login',{
        title: 'Log into your account'
    })
};
exports.getResetPasswordForm = (req,res)=>{
    res.status(200).render('resetPassword',{
        title: 'Reset your Password'
    })
};

exports.getSignUpForm = (req,res)=>{
    res.status(200).render('signUp',{
        title: 'Sign Up your account'
    })
};

exports.getAccount = (req,res)=>{
    res.status(200).render('account',{
        title: 'Your account'
    })
};

exports.getMyTours = catchAsync(async(req, res, next) => {
    //1) find a bookings
    const bookings= await Booking.find({
        user: req.user.id
    })

    //2)find tours with the returned Ids
    const tourIds = bookings.map(el => el.tour)
    const tours = await Tour.find({_id: {$in: tourIds}})

    const reviews= await Review.find({
        tour: {$in: tourIds},
        user: req.user.id
    });

    res.status(200).render('myTour', {
        title: 'My tours',
        tours,
        reviews
    })
})

exports.getMyReviews = catchAsync(async(req, res, next) => {

    const reviews= await Review.find({
        user: req.user.id
    });

    const tourIds = reviews.map(el => el.tour)
    const tours = await Tour.find({_id: {$in: tourIds}})

    res.status(200).render('myReview',{
        title: 'My Reviews',
        reviews,
        tours
    });
})

exports.getAllBookedTour = catchAsync(async(req, res) => {
    const bookings= await Booking.find();

    //2)find tours with the returned Ids
    const tourIds = bookings.map(el => el.tour)
    const tours = await Tour.find({_id: {$in: tourIds}})

    const userIds = bookings.map(el => el.user)
    const users = await User.find({_id: {$in: userIds}})

    res.status(200).render('allBookedTour', {
        title: 'All Booked Tour',
        bookings,
        tours,
        users
    })
})

exports.getAllUser = catchAsync(async(req, res) => {
    
    const features = new APIFeatures(User.find(),req.query).filter().sort().limitFields().paginate()
    const users = await features.query;

    res.status(200).render('allUser', {
        title: 'All User',
        users
    })
})

exports.getAllTour = catchAsync(async(req, res) => {

    res.status(200).render('editTour', {
        title: 'All Tour'
    })
})

// exports.updateUserData = catchAsync(async(req,res,next)=>{
//     const updatedUser = await User.findByIdAndUpdate(req.user.id,{
//         name: req.body.name,
//         email: req.body.email
//     },{
//         new: true,
//         runValidators: true
//     }
//     );
//     res.status(200).render('account',{
//         title: 'Your account',
//         user: updatedUser
//     })
// });


