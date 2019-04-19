const express = require('express');
const router = express.Router();
const {Task} = require('../../models');
const checkAuth = require('./checkAuth');

router.use('/', checkAuth);
router.use('/*', checkAuth);

router.get('/', async (req, res) => {
    const tasks = await Task.getAll();
    res.json(tasks);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const task = await Task.getOn(id);
    res.json(task);
});

router.post('/', async (req, res) => {
    const newTask = req.body;
    const id = await Task.add(newTask);
    res.json(id);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const updateTask = req.body;
    updateTask.id = id;
    await Task.update(updateTask);
    res.json(id);
});

module.exports = router;
