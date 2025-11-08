import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import * as userService from '../services/user.service.js';
import pick from '../utils/pick.js';

/**
 * Get interest list
 */
const interestList = catchAsync(async (req, res) => {
  const interests = await userService.interestList();
  res.status(httpStatus.OK).send({
    message: 'Interests retrieved successfully',
    data: interests,
  });
});

/**
 * Get users with filtering and pagination
 */
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['fullName', 'email', 'role', 'isEmailVerified', 'isDeleted', 'isSuspended']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

/**
 * Get user by ID
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    res.status(httpStatus.NOT_FOUND).send({
      message: 'User not found',
    });
    return;
  }
  res.send(user);
});

/**
 * Update user
 */
const updateUser = catchAsync(async (req, res) => {
  const { files } = req;
  const user = await userService.updateUserById(req.params.userId, req.body, files);
  res.send({
    message: 'User updated successfully',
    data: user,
  });
});

/**
 * Verify NID
 */
const verifyNid = catchAsync(async (req, res) => {
  const { nidNumber } = req.body;
  const user = await userService.verifyNid(req.user.id, nidNumber);
  res.status(httpStatus.OK).send({
    message: 'NID verification submitted successfully',
    data: user,
  });
});

/**
 * Approve NID verification
 */
const nidVerifyApproval = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const user = await userService.nidVerifyApproval(userId);
  res.status(httpStatus.OK).send({
    message: 'NID verification approved successfully',
    data: user,
  });
});

/**
 * Reject NID verification
 */
const nidVerifyReject = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const user = await userService.nidVerifyReject(userId);
  res.status(httpStatus.OK).send({
    message: 'NID verification rejected',
    data: user,
  });
});

/**
 * Get NID verification submit list
 */
const nidVerifySubmitList = catchAsync(async (req, res) => {
  const users = await userService.nidVerifySubmitList();
  res.status(httpStatus.OK).send({
    message: 'NID verification list retrieved successfully',
    data: users,
  });
});

export default {
  interestList,
  getUsers,
  getUser,
  updateUser,
  verifyNid,
  nidVerifyApproval,
  nidVerifyReject,
  nidVerifySubmitList,
};
