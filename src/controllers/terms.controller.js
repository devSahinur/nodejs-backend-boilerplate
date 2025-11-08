import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import response from '../config/response.js';
import { termsService } from '../services/index.js';

const createTerms = catchAsync(async (req, res) => {
  const terms = await termsService.createTerms(req.body);
  res
    .status(httpStatus.CREATED)
    .json(response({ message: 'Terms Created', status: 'OK', statusCode: httpStatus.CREATED, data: terms }));
});

const getTerms = catchAsync(async (req, res) => {
  const result = await termsService.queryTerms();
  res.status(httpStatus.OK).json(response({ message: 'Terms', status: 'OK', statusCode: httpStatus.OK, data: result }));
});

export default {
  createTerms,
  getTerms,
};

export { createTerms, getTerms };
