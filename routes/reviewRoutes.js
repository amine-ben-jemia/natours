const express = require('express')
const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController')

const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview)
    
router
    .route('/:id')
    .delete(authController.restrictTo('user','admin'),reviewController.deleteReview)
    .patch(reviewController.updateReview)  
    .get(reviewController.getReview)  

module.exports = router