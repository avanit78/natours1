const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne= Model => async(req,res,next)=>{
    try{
        const doc = await Model.findByIdAndDelete(req.params.id);
        res.status(204).json({
        status:'success',
        data:null
    });
    }catch(err){
        return next(new AppError('No doc found with that ID',404))
    }
};

exports.updateOne= Model => async(req,res,next)=>{
    try{
        const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators: true
            });        
            if(!doc){
                return next(new AppError('No document found with that ID',404))
            }
            res.status(200).json({
                status:'success',
                data:{
                    data:doc
                }
            });
    } catch(err){
        return next(new AppError(err,404))
    }
};

exports.createOne = Model => catchAsync(async(req,res,next)=>{
    // console.log(req.body.tour);
    // console.log(req.body.user);
    const doc = await Model.create(req.body);
        res.status(201).json({
            status:'success',
            data: {
                data :doc
            }
        });
});

exports.getOne = (Model,popOptions) => async(req,res,next)=>{
    try{
        let query = Model.findById(req.params.id);
        if(popOptions) query = query.populate(popOptions);
        const doc = await query;
        if(!doc){
            return next(new AppError('No document found with that ID',404))
        }
            res.status(200).json({
                status:'success',
                data:{
                    doc
                }
            });
    }catch(err){
        return next(new AppError('No document found with that ID',404))
    }
};

exports.getAll = Model => catchAsync(async(req,res)=>{
    // console.log(req.query);
    //execute query
    //To allow for nested get reviews on tour (hack)
    let filter = {};
    if(req.params.tourId) filter = {tour: req.params.tourId};

    const features = new APIFeatures(Model.find(filter),req.query).filter().sort().limitFields().paginate()
    const doc = await features.query;  //query.sort().select().skip().limit()
    // const doc = await features.query.explain(); use for check how many doc check for search quary
    //send response
    res.status(200).json({
        status:'success',
        results: doc.length,
        data:{
            data:doc
        }
    });
});