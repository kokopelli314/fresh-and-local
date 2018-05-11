const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    producerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    weight: {
        type: Number,
    },
    weightUnit: {
        type: String,
        enum: ['pound', 'gram', 'kilogram']
    },
});

const Product = new mongoose.model('Product', productSchema);
module.exports.Product = Product;

async function addProduct(producerId, data) {
    let product = new Product(data);
    return product.save();
}
module.exports.addProduct = addProduct;
