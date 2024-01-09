const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');
const ProductsController =  ('../controllers/products')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,"uploads")
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "-" + Date.now() + ".jpg")
    }
})
const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
      cb(null, true);  
    }
    else{
    cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
    fileSize: 1024 *1024 *5
     },
     fileFilter: fileFilter
 });

router.get('/',  ProductsController.products_get_all);
router.post('/',checkAuth,upload.single('productImage'), ProductsController.products_create_product);
router.get('/:productId', ProductsController.products_get_product);
router.patch('/:productId', checkAuth, ProductsController.products_update_product);
router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;
