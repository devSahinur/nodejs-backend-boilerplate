import fs from "fs";

function unlinkImage(imagePaths) {
  if (typeof imagePaths === "string") {
    // If it's a single image path, convert it to an array
    imagePaths = [imagePaths];
  }

  imagePaths.forEach((imagePath) => {
    fs.unlink(imagePath, (err) => {
      if (err) {
        // Handle error silently or with a logger if available
      } else {
        // Log success silently or with a logger if available
      }
    });
  });
}

export default unlinkImage;
