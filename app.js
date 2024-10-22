const express = require('express');
const morgan = require('morgan');
const path = require('path');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression')
// const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

//start express app
const app = express();

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));

// 1) GLOBAL MIDDLEWARES

// Serving static file
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname,'public')));

// console.log(process.env.NODE_ENV);
// Set Security HTTP headers
app.use(helmet());

//Development logging
if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'));
}

//Limit requsts from same API
const limiter = rateLimit({
    max:100,
    windowMs: 60*60*1000,
    message: 'Too many requests from  this IP, Please try again in an hour!'
});

app.use('/api',limiter);

//Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended:true, limit: '10kb'}));
app.use(cookieParser());

// Data sanitazation against NoSQL query injection
app.use(mongoSanitize());

//Data sanitazation against XSS
app.use(xss());

//Prevent parameter solution
app.use(hpp({
    whitelist:['duration','ratingsQuantity','ratingAverage','maxGroupSize','difficulty','price']
}));
    
// app.use((req,res,next)=>{
//     console.log('Hello from the middleware');
//     next();  
// });

//Test middleware
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});

app.use(compression());

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "script-src 'self' https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com; style-src 'self' https://api.mapbox.com https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; worker-src 'self' https://api.mapbox.com blob:; connect-src 'self' http://127.0.0.1:3000 ws://127.0.0.1:50102 ws://localhost:* ws://127.0.0.1:50006 ws://127.0.0.1:50026 ws://127.0.0.1:50580 https://api.mapbox.com https://events.mapbox.com;"
    );
    next();
});
//2) ROUTEHANDLES


// app.get('/api/v1/tours',getAllTours);
// app.get('/api/v1/tours/:id',getTour);
// app.post('/api/v1/tours',createTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);

//3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:'fail',
    //     message:`can't find ${req.originalUrl} on this server`
    // });

    // const err = new Error(`can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new Error(`can't find ${req.originalUrl} on this server`,404)); //when we write in next express automatic go to global define error
});

app.use(globalErrorHandler);


//4) Start Server
module.exports = app;