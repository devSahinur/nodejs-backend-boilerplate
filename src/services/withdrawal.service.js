import httpStatus from 'http-status';
import { Withdrawal } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a withdrawal request
 * @param {Object} withdrawalBody
 * @returns {Promise<Withdrawal>}
 */
const createWithdrawal = async (withdrawalBody) => {
  return Withdrawal.create(withdrawalBody);
};

/**
 * Query for withdrawals
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryWithdrawals = async (filter, options) => {
  const withdrawals = await Withdrawal.paginate(filter, options);
  return withdrawals;
};

/**
 * Get withdrawal by id
 * @param {ObjectId} id
 * @returns {Promise<Withdrawal>}
 */
const getWithdrawalById = async (id) => {
  return Withdrawal.findById(id);
};

/**
 * Get withdrawals by user
 * @param {ObjectId} userId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getWithdrawalsByUser = async (userId, options) => {
  return Withdrawal.paginate({ user: userId }, options);
};

/**
 * Update withdrawal by id
 * @param {ObjectId} withdrawalId
 * @param {Object} updateBody
 * @returns {Promise<Withdrawal>}
 */
const updateWithdrawalById = async (withdrawalId, updateBody) => {
  const withdrawal = await getWithdrawalById(withdrawalId);
  if (!withdrawal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Withdrawal not found');
  }
  Object.assign(withdrawal, updateBody);
  await withdrawal.save();
  return withdrawal;
};

/**
 * Delete withdrawal by id
 * @param {ObjectId} withdrawalId
 * @returns {Promise<Withdrawal>}
 */
const deleteWithdrawalById = async (withdrawalId) => {
  const withdrawal = await getWithdrawalById(withdrawalId);
  if (!withdrawal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Withdrawal not found');
  }
  await withdrawal.remove();
  return withdrawal;
};

/**
 * Approve withdrawal request
 * @param {ObjectId} withdrawalId
 * @param {string} transactionId
 * @returns {Promise<Withdrawal>}
 */
const approveWithdrawal = async (withdrawalId, transactionId) => {
  const withdrawal = await getWithdrawalById(withdrawalId);
  if (!withdrawal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Withdrawal not found');
  }
  if (withdrawal.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can only approve pending withdrawals');
  }
  withdrawal.status = 'completed';
  withdrawal.transactionId = transactionId;
  await withdrawal.save();
  return withdrawal;
};

/**
 * Reject withdrawal request
 * @param {ObjectId} withdrawalId
 * @param {string} reason
 * @returns {Promise<Withdrawal>}
 */
const rejectWithdrawal = async (withdrawalId, reason) => {
  const withdrawal = await getWithdrawalById(withdrawalId);
  if (!withdrawal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Withdrawal not found');
  }
  if (withdrawal.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can only reject pending withdrawals');
  }
  withdrawal.status = 'rejected';
  withdrawal.notes = reason;
  await withdrawal.save();
  return withdrawal;
};

export default {
  createWithdrawal,
  queryWithdrawals,
  getWithdrawalById,
  getWithdrawalsByUser,
  updateWithdrawalById,
  deleteWithdrawalById,
  approveWithdrawal,
  rejectWithdrawal,
};
