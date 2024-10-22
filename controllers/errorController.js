const AppError = require('./../utils/appError');

const handleCastErrorDB = err =>{
    const message = `Invalid ${err.patch}:${err.value}`;
    return new AppError(message,400);
}

const handleDuplicateFieldsDB = err =>{

    // const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: please try another value`;
    return new AppError(message,400);
}

const handleValidationErrorDB = err =>{

    const errors = Object.values(err.errors).map(el=>el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message,400);
}

const handleJWTError = err => new AppError('Invalid token. Please log in again',401)
const handleJWTExpiredError = err => new AppError('Token is expired Please log in again',401)

const sendErrorDev = (err,req,res)=>{
    //API
    if(req.originalUrl.startsWith('/api')){
        return res.status(err.statusCode).json({
            status:err.status,
            // error: err,
            message:err.message,
            // stack: err.stack
        });
    } 
        //RENDERED ERRRO
        console.log('ERROR',err);
        return res.status(err.statusCode).render('error',{
            title: 'Something went wrong!',
            msg: err.message
        })
}

const sendErrorProd = (err,req,res,next)=>{
    //operational error send message to client
    if(err.isOperational){
        // console.log("Avanit");
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        });
        //programming error don't leak error
    }else{
        // console.log("Avanit 2");
        // console.log('ERROR',err);
        res.status(404).json({
            status: err.status,
            message:'Something went very wrong!'
        })
    }
}

module.exports = (err,req,res,next)=>{   //when we write 4 args it understand global error
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        let error = {...err};
        error.message = err.message;

        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        if(error.name === 'ValidatorError') error = handleValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
        // sendErrorProd(error,res);
        sendErrorDev(err,req,res);

    }else if(process.env.NODE_ENV === 'production'){
        let error = {...err};
        error.message = err.message;
        
        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        if(error.name === 'ValidatorError') error = handleValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
        sendErrorProd(err,req,res);
    }
};