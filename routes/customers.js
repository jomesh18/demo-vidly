const express = require('express');
const router = express.Router();
const { validateCustomer, Customer } = require('../models/customer');
const validate = require('../middleware/validate');

router.get('/', validate(validateCustomer), async (req, res) => {
    const customers = await Customer.find();
    res.status(200).send(customers);
});

router.post('/', validate(validateCustomer), (req, res) => {

    Customer.create(req.body)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(err));
});

router.put('/:id', validate(validateCustomer), async (req, res) => {

    let customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).send('Customer with given id not found');
    res.status(200).send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) return res.status(404).send('Customer with given id not found');
    res.status(200).send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('Customer with given id not found');
    res.status(200).send(customer);
})


module.exports = router;