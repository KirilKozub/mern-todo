const {Router} = require('express');
const router = Router();
const Todo = require('../models/Todo');

router.post('/add', async (req, res) => {
    try {
        const {text, userId} = req.body
        const todo = await new Todo({
            text,
            owner: userId,
            completed: false,
            timestamp: Date.now(),
        })

        await todo.save();
        const todos = await Todo.find({ owner: userId });
        res.json(todos);
    } catch (error) {
        console.log(error);
    }
})

router.get('/', async ({query: {userId: owner}}, res) => {
    try {
        const todos = await Todo.find({ owner });
        res.json(todos);
        
    } catch (error) {
        console.log(error);
    }
})

router.delete('/delete/:id', async ({params: {id}}, res) => {
    try {
        const {owner} = await Todo.findOneAndDelete({_id: id});
        const todos = await Todo.find({ owner });
        res.json(todos);
    } catch (error) {
        console.log(error);
    }
})

router.put('/complete/:id', async ({params: {id}}, res) => {
    try {
        const todo = await Todo.findOne({_id: id});
        todo.completed = !todo.completed;

        await todo.save();
        const todos = await Todo.find({ owner: todo.owner });
        res.json(todos);
    } catch (error) {
        console.log(error);
    }
})

router.put('/edit/:id', async ({body: { id, newText }}, res) => {
    try {
        const todo = await Todo.findOneAndUpdate({_id: id}, {text: newText}, {returnOriginal: false});
        await todo.save();
        const todos = await Todo.find({ owner: todo.owner });
        res.json(todos);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router