var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpecificationSchema = new Schema({
    attribute: { type: String, required: true, maxlength: 100 },
    value: { type: String, required: true, maxlength: 100 },
    notes: { type: String, maxlength: 150 },
});

var ProductSchema = new Schema({
    name: { type: String, required: true, maxlength: 100 },
    categoryID: { type: String, required: true },
    ownerID: { type: String, required: true },
    createdDate: {type: Date, default: Date.now},
    expirationDate: { type: Date, required: true },
    quantity: { type: Number, required: true, min: 1 },
    basePrice: { type: Number, required: true, min: 1 },
    description: { type: String, maxlength: 250 },
    specifications: [SpecificationSchema]
});

module.exports = mongoose.model('Product', ProductSchema);