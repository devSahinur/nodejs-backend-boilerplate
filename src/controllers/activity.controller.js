import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import { Activity } from '../models/index.js';
import pick from '../utils/pick.js';

/**
 * Get activities by user ID
 */
const getActivitiesById = catchAsync(async (req, res) => {
  const filter = { user: req.user.id };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Set default sort to newest first
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }

  const activities = await Activity.paginate(filter, options);

  res.status(httpStatus.OK).send({
    message: 'Activities retrieved successfully',
    data: activities,
  });
});

/**
 * Delete activity by ID
 */
const deleteActivityById = catchAsync(async (req, res) => {
  const activity = await Activity.findOne({
    _id: req.params.id,
    user: req.user.id, // Ensure user can only delete their own activities
  });

  if (!activity) {
    res.status(httpStatus.NOT_FOUND).send({
      message: 'Activity not found',
    });
    return;
  }

  await activity.remove();

  res.status(httpStatus.OK).send({
    message: 'Activity deleted successfully',
  });
});

export default {
  getActivitiesById,
  deleteActivityById,
};
