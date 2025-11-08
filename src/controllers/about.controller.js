import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import response from '../config/response.js';
import { aboutService } from '../services/index.js';

const createAbout = catchAsync(async (req, res) => {
  const about = await aboutService.createAbout(req.body);
  res
    .status(httpStatus.CREATED)
    .json(response({ message: 'About Created', status: 'OK', statusCode: httpStatus.CREATED, data: about }));
});

const getAbouts = catchAsync(async (req, res) => {
  const result = await aboutService.queryAbouts();
  res.status(httpStatus.OK).json(response({ message: 'About', status: 'OK', statusCode: httpStatus.OK, data: result }));
});

export default {
  createAbout,
  getAbouts,
};

export { createAbout, getAbouts };
