import httpStatus from 'http-status';
import { Terms } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import he from 'he';

const createTerms = async (termsBody) => {
  termsBody.content = he.decode(termsBody.content);
  const existingTerms = await Terms.findOne();

  if (existingTerms) {
    // If an entry exists, update it
    existingTerms.set(termsBody);
    await existingTerms.save();
    return existingTerms;
  } else {
    // If no entry exists, create a new one
    const newTerms = await Terms.create(termsBody);
    return newTerms;
  }
};

const queryTerms = async () => {
  const terms = await Terms.find();
  return terms;
};

export { createTerms, queryTerms };
