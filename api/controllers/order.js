const Order = require('../models/order');
const Product = require('../models/products');



exports.getOrder = (req, res, next)=> {
    Order.find()
        .populate('product', 'name price')
        .then(result=> {
            res.status(200).json({
                count : result.length,
                orders: result.map(order=> {
                    return {
                        product: order.product,
                        quantity: order.quantity,
                        _id: order._id,
                    }
                })
            });
        })
        .catch(err=> {
            res.status(500).json({
                error: err
            });
        })
}

exports.submitOrder = (req, res, next)=> {
    // check whether the product is in the database
    const id = req.body.productId;
    Product.findById(id)
        .then(result=> {
            if (!result) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                quantity: req.body.quantity,
                product: req.body.productId,
            });
            return order.save();
            })
        .then(result=> {
            // the above .then block may send 404 to here,
            // if it's 404, we just return res to end this .then block
            if(res.statusCode === 404){
                return res;
            }
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
            });
        })
        .catch(err=> {
            res.status(500).json({
                error: err,
            })
        })
}

exports.getOrderId =(req, res, next)=> {
    Order.findById(req.params.orderId)
        .populate('product')
        .select('product quantity _id')
        .then(result=> {
            if (result) {
                res.status(200).json({
                    order: result,
                });
            }
            else {
                res.status(404).json({
                    message: 'No valid entry for the order ID'
                });
            }
        })
        .catch(err=> {
            res.status(500).json({
                error: err
            });
        })
}

exports.deleteOrder = (req, res, next)=> {
    Order.findByIdAndDelete(req.params.orderId)
        .then(result=> {
            if (result) {
                res.status(200).json({
                    message: 'Order deleted'
                });
            }
            else {
                res.status(404).json({
                    message: 'No valid entry for the order ID'
                });
            }
        })
        .catch(err=> {
            res.status(500).json({
                error: err,
            })
        })
}