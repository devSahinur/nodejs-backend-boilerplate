import httpStatus from 'http-status';
import { Referral } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a referral
 * @param {Object} referralBody
 * @returns {Promise<Referral>}
 */
const createReferral = async (referralBody) => {
  return Referral.create(referralBody);
};

/**
 * Query for referrals
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryReferrals = async (filter, options) => {
  const referrals = await Referral.paginate(filter, options);
  return referrals;
};

/**
 * Get referral by id
 * @param {ObjectId} id
 * @returns {Promise<Referral>}
 */
const getReferralById = async (id) => {
  return Referral.findById(id);
};

/**
 * Get referrals by referrer id
 * @param {ObjectId} referrerId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getReferralsByReferrer = async (referrerId, options) => {
  return Referral.paginate({ referrer: referrerId }, options);
};

/**
 * Update referral by id
 * @param {ObjectId} referralId
 * @param {Object} updateBody
 * @returns {Promise<Referral>}
 */
const updateReferralById = async (referralId, updateBody) => {
  const referral = await getReferralById(referralId);
  if (!referral) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found');
  }
  Object.assign(referral, updateBody);
  await referral.save();
  return referral;
};

/**
 * Delete referral by id
 * @param {ObjectId} referralId
 * @returns {Promise<Referral>}
 */
const deleteReferralById = async (referralId) => {
  const referral = await getReferralById(referralId);
  if (!referral) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found');
  }
  await referral.remove();
  return referral;
};

export default {
  createReferral,
  queryReferrals,
  getReferralById,
  getReferralsByReferrer,
  updateReferralById,
  deleteReferralById,
};
