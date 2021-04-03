const Order = require('../models/order');
const Product = require('../models/products');

exports.getProduct = (req, res, next)=> {
    Product.find()
        .select('name price _id productImage')
        .then(result=> {
            const response = {
                count: result.length,
                // return the info we need
                products: result.map(product=> {
                    return {
                        name: product.name,
                        price: product.price,
                        _id: product._id,
                        productImage: product.productImage,
                    }
                }) 
            }
            res.status(200).json(response);
        })
        .catch(err=> {
            console.log(err);
        })
}

exports.submitProduct = (req, res, next)=> {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
    });
    product.save()
        .then(result=> {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST request to /products.',
                createdProduct: {
                    name: result.name,
                    price: result.pricse,
                    _id: result._id,
                },
            });
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        })   
}

exports.getProductId = (req, res, next)=> {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .then(result=> {
            console.log("From database", result);
            if (result) {
                res.status(200).json({
                    product: result,
                });
            }else {
                res.status(404).json({
                    message: 'No valid entry for the product ID'
                });
            };
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        })     
}

exports.updateProduct = (req, res, next)=> {
    const id = req.params.productId;

    // update the changed items
    // $set to target the body which is needed to be changed
    Product.findByIdAndUpdate(id, {$set: req.body}, {new: true})
        .select('name price _id')
        .then(result=> {
            console.log(result);
            res.status(200).json({
                message: 'Product updated',
                name: result.name,
                price: result.price,
            });
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json(err);
        })
}

exports.deleteProducts = (req, res, next)=> {
    const id = req.params.productId;
    Product.findByIdAndRemove(id)
        .then(result=> {
            console.log(result);
            res.status(200).json({
                message: 'Product deleted',
            });
        })
        .catch(err=> {
            console.log(err);
        })
}