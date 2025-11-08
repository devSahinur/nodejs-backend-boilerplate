import he from 'he';
import { About } from '../models/index.js';


const createAbout = async (aboutBody) => {
 // Try to find an existing About entry
 const existingAbout = await About.findOne();
 aboutBody.content = he.decode(aboutBody.content);

 if (existingAbout) {
     // If an entry exists, update it
     existingAbout.content = aboutBody.content; // Assign raw HTML content
     await existingAbout.save();
     return existingAbout;
 } 
     // If no entry exists, create a new one
     const newAbout = await About.create(aboutBody);
     return newAbout;
 
};



const queryAbouts = async () => {
    const abouts = await About.find();
    return abouts;
};

export default { createAbout, queryAbouts };

export { createAbout, queryAbouts };