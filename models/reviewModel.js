const mongoose = require('mongoose');
const validator = require('validator');
const Tour = require('./tourModel');

const ReviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review can not be empty']
    },
    rating:{
        type:Number,
        min: 1,
        max: 5
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    tour:{
            type: mongoose.Schema.ObjectId,
            ref:'Tour',
            required:[true,'Tour must belong to Review']
        },
    user:{
            type: mongoose.Schema.ObjectId,
            ref:'User',
            required:[true,'Review must belong to user']
        }    
},
{
    toJSON: {virtuals: true},
    toObject:{virtuals:true}
});

ReviewSchema.index({tour:1,user:1},{unique:true});

ReviewSchema.pre(/^find/,function(next){
    // this.populate({
    //     path:'tour',
    //     select:'name'
    // }).populate({
    //     path:'user',
    //     select:'name photo'
    // });
    this.populate({
        path:'user',
        select:'name photo'
    });
    next();
});

ReviewSchema.statics.calcAverageRatings = async function(tourId){
    const stats = await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id: '$tour',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ]);
    if(stats.length>0){
        await Tour.findByIdAndUpdate(tourId,{
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    }else{
        await Tour.findByIdAndUpdate(tourId,{
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};

ReviewSchema.post('save',function(){
    //this point current review
    this.constructor.calcAverageRatings(this.tour);
});

ReviewSchema.pre(/^findOneAnd/,async function(next){
    this.r = await this.findOne();
    // console.log(this.r);
    next();
});

ReviewSchema.post(/^findOneAnd/,async function(){
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review',ReviewSchema);
module.exports = Review;