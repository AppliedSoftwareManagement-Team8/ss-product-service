var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Product = require('../models/product');


mongoose.connect('mongodb://localhost/ss-product');

/* Create a new Product */
router.post('/', function (req, res, next) {

    var product = new Product();
    product.name = req.body.name;
    product.categoryID = req.body.categoryID;
    product.ownerID = req.body.ownerID;
    product.expirationDate = new Date(req.body.expirationDate);
    product.quantity = req.body.quantity;
    product.basePrice = req.body.basePrice;
    product.description = req.body.description;
    product.specifications = req.body.specifications;

    // save the product and check for errors
    product.save(function (err) {
        if (err)
            return res.status(err.status || 500).json(err);
        res.status(201, "Created").json({message: 'Product was created!'});
    });
});

/* GET all Products. */
router.get('/', function (req, res, next) {
    Product.count({categoryID: req.params.categoryId}, function (err, count) {
        Product.find(function (err, products) {
            if (err)
                return res.status(err.status || 500).json(err);
            var data = {count: count, products: products};
            res.status(200).json(data);
        });
    });
});

/* GET a product page by Category */
router.get('/category/:categoryId/:pageNum', function (req, res, next) {
    Product.count({categoryID: req.params.categoryId}, function (err, count) {
        Product.find({categoryID: req.params.categoryId}).
        skip(10 * parseInt(req.params.pageNum)).
        limit(10).
        sort('-createdDate').
        lean().
        exec(function (err, products) {
            if (err)
                return res.status(err.status || 500).json(err);
            var data = {count: count, products: products};
            res.status(200).json(data);
        });
    });
});

/* GET a product page by search query */
router.get('/search/:query/:pageNum', function (req, res, next) {
    var reg = new RegExp(".*" + req.params.query + ".*", "i");
    Product.count({name: reg}, function (err, count) {
        Product.find({name: reg}).
        skip(10 * parseInt(req.params.pageNum)).
        limit(10).
        sort('-createdDate').
        lean().
        exec(function (err, products) {
            if (err)
                return res.status(err.status || 500).json(err);
            var data = {count: count, products: products};
            res.status(200).json(data);
        });
    });

});

/* GET all Products of a user by ID */
router.get('/owner/:ownerID', function (req, res, next) {
    Product.find().
    where('ownerID').equals(req.params.ownerID).
    sort('-createdDate').
    exec(function (err, products) {
        if (err)
            return res.status(err.status || 500).json(err);
        res.status(200).json(products);
    });
});

/* Get a single Product by ID */
router.get('/:id', function (req, res, next) {
    Product.findById(req.params.id, function (err, product) {
        if (err)
            return res.status(err.status || 500).json(err);
        res.status(200).json(product);
    });
});

/* Update a Product */
router.put('/:id', function (req, res, next) {
    Product.findById(req.params.id, function (err, product) {
        if (err)
            return res.status(err.status || 500).json(err);

        product.name = req.body.name;
        product.categoryID = req.body.categoryID;
        product.ownerID = req.body.ownerID;
        product.expirationDate = req.body.expirationDate;
        product.quantity = req.body.quantity;
        product.basePrice = req.body.basePrice;
        product.description = req.body.description;
        product.specifications = req.body.specifications;

        product.save(function (err) {
            if (err)
                return res.status(err.status || 500).json(err);
            res.status(200).json({message: 'Product has been updated!'});
        });

    });
});

/* Delete a Product */
router.delete('/:id', function (req, res, next) {
    Product.remove({
        _id: req.params.id
    }, function (err, product) {
        if (err)
            return res.status(err.status || 500).json(err);
        res.status(200).json({message: 'Product was successfully deleted!'});
    });
});

module.exports = router;