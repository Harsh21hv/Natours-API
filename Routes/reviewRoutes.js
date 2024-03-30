const reviewController = require('../Controllers/reviewController');
const express = require('express');
const authController = require('../Controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(authController.restrictTo('admin', 'user'),reviewController.deleteReview)
  .patch(authController.restrictTo('admin', 'user'),reviewController.updateReview);

module.exports = router;
