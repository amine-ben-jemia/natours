const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Booking = require('../models/bookingModel')
const User = require('../models/userModel')


exports.getOverview = catchAsync( async (req,res,next)=>{
    // 1) Get tour data from collection
    const tours = await Tour.find()
    // 2) Build template

    // 3) Render that template
    res.status(200).render('overview',{
      title:'All Tours',
      tours
      
    })
})

exports.getTour = catchAsync(async (req,res,next)=>{
  const tour = await (await Tour.findOne({ slug:req.params.slug }).populate({
    path:'reviews',
    fields: 'review rating user'
  }))
  if (!tour) {
    return next(new AppError ('There is no tour with that name',404) )
}
  res.status(200).render('tour',{
      title: `${tour.name} Tour`,
      tour
    })

})

exports.getLoginForm = catchAsync( async (req,res,next)=>{

  res.status(200).render('login',{
    title:'Log into your account',
    
  })
})

exports.getAccount = catchAsync( async (req,res,next)=>{

  res.status(200).render('account',{
    title:'Your account'  
  })
})

exports.getMyTours = catchAsync( async (req,res,next)=>{
  // 1) Find all bookings
  const bookings = await Booking.find({ user:req.user.id })

  // 2) Find tours with the returned IDs
  const tourIds = bookings.map(el=> el.tour)
  const tours = await Tour.find({ _id: { $in: tourIds }})

  res.status(200).render('overview',{
    title:'My tours',
    tours
  })
})



exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  )

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  })
})