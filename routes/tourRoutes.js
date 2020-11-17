const express = require('express')
const tourController = require('../controllers/tourController')
const router = express.Router()
const authController = require('../controllers/authController')
const reviewRouter = require('./reviewRoutes')
const { Router } = require('express')
//router.param('id',tourController.checkID)

router.use('/:tourId/reviews',reviewRouter)

router
.route('/top-5-cheap')
.get(tourController.aliasTopTours , tourController.getAllTours)

router
.route('/tour-stats')
.get(tourController.getTourStats)

router
.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan)

router
.route('/tours-within/:distance/center/:latlng/unit/:unit')
.get(tourController.getToursWithin)
// /tours-distance?distance=233&center=40,45&unit=mi
// /tours-distance/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)


router
  .route('/')
  .get(authController.protect,tourController.getAllTours)
  .post(tourController.createTour)

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour)
  .delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour)




module.exports = router