import httpStatus from 'http-status';
import { Privacy } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import he from 'he';


const createPrivacy = async (privacyBody) => {

    privacyBody.content = he.decode(privacyBody.content);
   
    const existingPrivacy = await Privacy.findOne();

    if (existingPrivacy) {
        // If an entry exists, update it
        existingPrivacy.set(privacyBody);
        await existingPrivacy.save();
        return existingPrivacy;
    } else {
        // If no entry exists, create a new one
        const newPrivacy = await Privacy.create(privacyBody);
        return newPrivacy;
    }
};

const queryPrivacy = async () => {
    const privacy = await Privacy.find();
    return privacy;
};


export { createPrivacy, queryPrivacy };