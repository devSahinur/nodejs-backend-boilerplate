import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import response from '../config/response.js';
import { privacyService } from '../services/index.js';

const createPrivacy = catchAsync(async (req, res) => {
  const privacy = await privacyService.createPrivacy(req.body);
  // console.log(privacy)
  res
    .status(httpStatus.CREATED)
    .json(response({ message: 'Privacy Created', status: 'OK', statusCode: httpStatus.CREATED, data: privacy }));
});

const getPrivacy = catchAsync(async (req, res) => {
  const result = await privacyService.queryPrivacy();
  res
    .status(httpStatus.OK)
    .json(response({ message: 'Privacy', status: 'OK', statusCode: httpStatus.OK, data: result }));
});

export default {
  createPrivacy,
  getPrivacy,
};

export { createPrivacy, getPrivacy };
