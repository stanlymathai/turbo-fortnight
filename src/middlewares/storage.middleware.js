const multer = require('multer');
const fs = require('fs');
const path = require('path');

const USER_FILE_PATH = 'uploads/user/';

const getFileType = (file) => {
  const mimeType = file.mimetype.split('/');
  return mimeType[mimeType.length - 1];
};

const generateFileName = (req, file, cb) => {
  const extension = getFileType(file);

  const filename =
    Date.now() + '-' + Math.round(Math.random() * 1e9) + '.' + extension;
  cb(null, file.fieldname + '-' + filename);
};


// Configure multer storage and file name
const storage = multer.diskStorage({
  destination: USER_FILE_PATH,
  filename: generateFileName
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
module.exports.userFile  = (req, res, next) => {
  // Use multer upload instance
  upload.fields([
    { name: 'images', maxCount: 5 }, // Field name 'images', allow up to 5 files
    { name: 'videos', maxCount: 3 }  // Field name 'videos', allow up to 3 files
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
   
    // Retrieve uploaded files
    let images = [];
    let videos = [];
     const errors = [];
    if (req.files['images'] != null && req.files['images'] != undefined ) {
     images = req.files['images'];
    

    // Validate file types and sizes
    images.forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      images.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.files['images'] = images;
    }
    // validate for video 

    if (req.files['videos'] != null && req.files['videos'] != undefined ) {
    // Retrieve uploaded files
       videos = req.files['videos'];
   
    // Validate file types and sizes
    videos.forEach((file) => {
      const allowedTypes = ['video/mp4', 'video/mpeg', 'video/webm', 'video/quicktime'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      videos.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }
  }
    // Attach files to the request object
    req.files['images'] = images;
    req.files['videos'] = videos;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports.profileImage  = (req, res, next) => {
  // Use multer upload instance
  upload.fields([
    { name: 'profileImages', maxCount: 2 }, // Field name 'profileImages', allow up to 1 files
    { name: 'bannerImages', maxCount: 2 }  // Field name 'bannerImages', allow up to 1 files
  ])(req, res, (err) => {
    if (err) {
     
      return res.status(400).json({ error: err.message });
    }
    // Retrieve uploaded files
    let profileImages = [];
    let bannerImages = [];
     const errors = [];
       if(req.files == undefined){
        req.files= ['bannerImages','profileImages'];
       }
    if (req.files['profileImages'] != undefined && req.files['profileImages'] != null ) {
      profileImages = req.files['profileImages'];
    

    // Validate file types and sizes
    profileImages.forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      profileImages.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }
    req.files['profileImages'] = profileImages;
    }else{
      req.files['profileImages'] = [];
    }
    
    // validate for bannerImages 

    if (req.files['bannerImages'] != undefined &&req.files['bannerImages'] != null  ) {
    // Retrieve uploaded files
    bannerImages = req.files['bannerImages'];
   
    // Validate file types and sizes
    bannerImages.forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      videos.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }
    req.files['bannerImages'] = bannerImages;
  }
  else{
    req.files['bannerImages'] = [];
  }
    // Attach files to the request object
   
   

    // Proceed to the next middleware or route handler
    next();
  });
};



