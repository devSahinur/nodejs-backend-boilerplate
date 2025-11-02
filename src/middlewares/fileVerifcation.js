import upload from "./fileUpload.js";
import logger from "../config/logger.js";
import response from "../config/response.js";

const imageVerification = (req, res, next) => {
  const files = req.files || [];

  if (files.length === 0) {
    logger.error();
    return res.status(403).json(
      response({
        code: "403",
        message: "Images not found",
      })
    );
  } else {
    next();
  }
};

export default imageVerification;
