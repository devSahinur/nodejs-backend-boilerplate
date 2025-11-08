import he from 'he';
import { Terms } from '../models/index.js';

const createTerms = async (termsBody) => {
  termsBody.content = he.decode(termsBody.content);
  const existingTerms = await Terms.findOne();

  if (existingTerms) {
    // If an entry exists, update it
    existingTerms.set(termsBody);
    await existingTerms.save();
    return existingTerms;
  }
  // If no entry exists, create a new one
  const newTerms = await Terms.create(termsBody);
  return newTerms;
};

const queryTerms = async () => {
  const terms = await Terms.find();
  return terms;
};

export default { createTerms, queryTerms };

export { createTerms, queryTerms };
