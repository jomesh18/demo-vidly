const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String, 
        required: true
    },
    isGold: { type: Boolean, deafult: false }
});

const Customer = mongoose.model('Customer', customerSchema);

const validate_customer = (customer) => {
    const schema = Joi.object({
        name: Joi.string()
        .alphanum()
        .min(3)
        .required(),
        phone: Joi.string()
        .required(),
        isGold: Joi.boolean()
    });
    return schema.validate(customer);
}

module.exports = { validate_customer, Customer};