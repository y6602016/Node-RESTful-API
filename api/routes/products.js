const express = require('express');
const router = express.Router();
// nulter is the middleware for file uploading
const multer = require('multer');
// checkAuth to protect routes
const checkAuth = require('../middleware/check-auth');

const productController = require('../controllers/products');
// setting the file storage place and file name
const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, './uploads/');
    },
    filename: (req, file, cb)=> {
        cb(null, Date.now()+file.originalname);
    }
});

const fileFilter = (req, file, cb)=> {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};

// create a multer object
const upload = multer({
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.route('/')
    .get(productController.getProduct)
    // put the upload header before the request header
    .post(checkAuth, upload.single('productImage'), productController.submitProduct);

router.route('/:productId')
    .get(productController.getProductId)
    .patch(checkAuth,productController.submitProduct)
    .delete(checkAuth,productController.deleteProducts)

module.exports = router;