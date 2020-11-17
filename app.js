const path = require('path')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const viewRouter = require('./routes/viewRoutes')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const bookingRouter = require('./routes/bookingRoutes')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const app = express()



app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))

// Serving static files
app.use(express.static(path.join(__dirname,'public')))


// Set Security HTTP headers
// app.use(helmet())
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQauntity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
    )

// Limit request from the same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60*60*1000,
  message: 'Too many requests from this IP, please try again in an hour'
})

app.use('/api',limiter)


// Body parser , reading data from body into req.body
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({ extended:true , limit:'10kb'}))
app.use(cookieParser())
 

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())
// Data sanizataion againt XSS
app.use(xss())


// Test middleware
app.use((req, res, next) => {
  
  req.requestTime = new Date().toISOString()
  //console.log(req.cookies);
  next()
})

// 3) ROUTES
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

app.all('*', (req, res, next) => {
  

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
