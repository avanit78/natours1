const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('./../utils/appError');
const Tour = require('./../models/tourModel');
// const Booking = require('./../models/bookingModel')
const Booking = require('./../models/BookingModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async(req, res, next) => {
    // 1) Get the current booked tour
    const tour = await Tour.findById(req.params.tourId);

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment', // Add the mode parameter
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
                    },
                    unit_amount: tour.price * 100
                },
                quantity: 1
            }
        ]
    });

    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session
    });
});

exports.createBookingCheckout = catchAsync(async(req, res, next) => {
    // This is temporary, because it's unsecure
    const {tour, user, price} = req.query;

    if (!tour || !user || !price) return next();

    await Booking.create({tour, user, price});

    res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

exports.getReportTour = catchAsync(async (req, res, next) => {
    const { startDate, endDate } = req.body;

    // 1) Check if startDate and endDate exist
    if (!startDate || !endDate) {
        return next(new AppError('Please provide both start and end dates!', 400));
    }

    // Convert the string date format to JavaScript Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if the dates are valid
    if (isNaN(start) || isNaN(end)) {
        return next(new AppError('Invalid date format provided!', 400));
    }

    // Query to find bookings within the specified date range
    const bookings = await Booking.find({
        createdAt: {
            $gte: start,  // Greater than or equal to start date
            $lte: end     // Less than or equal to end date
        }
    });

    // 2) Find tours with the returned booking IDs
    const tourIds = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });

    // 3) Find users with the returned booking IDs
    const userIds = bookings.map(el => el.user);
    const users = await User.find({ _id: { $in: userIds } });

    // Send the response with the data
    res.status(200).json({
        status: 'success',
        data: {
            bookings,
            tours,
            users
        }
    });
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  