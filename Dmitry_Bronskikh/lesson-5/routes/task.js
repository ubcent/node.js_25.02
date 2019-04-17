const express = require('express');
const router = express.Router();
const {Task} = require('../models');

router.get('/', async (req, res) => {
    const tasks = {
        header: 'Задачи',
        tasks: await Task.getAll(),
    };
    res.render('task/index', tasks);
});

router.get('/create', async (req, res) => {
    const task = {
        header: 'Создание задачи',
    };
    res.render('task/form', task);
});

router.post('/create', async (req, res) => {
    const newTask = req.body;
    const id = await Task.add(newTask);
    res.redirect(`/task/${id}`);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    redirectIfWrongId(id, res);
    const task = {
        header: `Задача ${id}`,
        task: await Task.getOn(id),
    };
    res.render('task/view', task);
});

router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    redirectIfWrongId(id, res);
    Task.delete(id);
    res.redirect('..');
});

router.get('/update/:id', async (req, res) => {
    const id = req.params.id;
    redirectIfWrongId(id, res);
    const task = {
        header: 'Редактирование задачи',
        task: await Task.getOn(id),
    };
    res.render('task/form', task);
});

router.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    redirectIfWrongId(id, res);
    const updateTask = req.body;
    updateTask.id = id;
    await Task.update(updateTask);
    res.redirect(`/task/${id}`);
});

const redirectIfWrongId = (id, res) => {
    if (!Number.isInteger(+id)) {
        res.redirect('/task');
    }
};

module.exports = router;
