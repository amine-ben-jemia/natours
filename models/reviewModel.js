const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema({
    review:
        { 
            type:String,
            require:[true,'Review can not be empty !']
        },
    rating:
        {
            type:Number,
            min:1,
            max:5
        } ,
    createdAt: 
        {
            type: Date,
            default: Date.now()
        },
    tour:
        {    
            type: mongoose.Schema.ObjectId,
            ref:'Tour',
            required:[true,'Review must belong to a tour']
        },
    user: 
        {
            type: mongoose.Schema.ObjectId,
            ref:'User',
            required:[true,'Review must belong to a user']
        },
    },

    { 
        toJSON: 
        { 
            virtuals: true
         }, 
         toObject: 
        { 
             virtuals: true 
        }
    
})
  
 
reviewSchema.index({ tour: 1 , user: 1 }, { unique: true });
reviewSchema.pre(/^find/,function(next){
    // this.populate({
    //     path:'tour',
    //     select:'name'
    // })
    this.populate({
        path:'user',
        select:'name photo'
    })
    next()
})

// Calculate the average when creating a new review
reviewSchema.statics.calcAverageRatings = async function (tourId){
    const stats = await this.aggregate([
        {
            $match : { tour : tourId }
        },
        {
            $group:{
                _id:'$tour',
                nRating: { $sum:1 },
                avgRating: {$avg: '$rating'}
            }
        }
    ])
    await Tour.findById(tourId,{
        ratingsQauntity: stats[0].nRating,
        ratingsAverage:stats[0].avgRating,
    })
   
}

reviewSchema.post('save',function(){
    this.constructor.calcAverageRatings(this.tour)
    // this points to current review
    
})

// Update ratingsQauntity and ratingsAverage when updating and deleting
reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne()
    next()
})

reviewSchema.post(/^findOneAnd/, async function(next){
    await this.r.constructor.calcAverageRatings(this.r.tour)
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review