const express = require('express');
const router = express.Router();
const { validateCustomer, Customer } = require('../models/customer');

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).send(customers);
    }
    catch (ex) {
        res.status(404).send(ex);
    }
});

router.post('/', (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    Customer.create(req.body)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(err));
});

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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