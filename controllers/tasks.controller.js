const taskModel = require("../model/tasks.model");

// API Logics

// GET api
const allTasks = async (req, res) => {
    try {
        const tasks = await taskModel.find({
            user: req.userId
        }).sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Task Fetching failed" });
    }
};

// POST api
const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        // basic validation
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        // description & status

        const task = await taskModel.create({ title, description, status, user: req.userId });

        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: "Task Creation Failed" })
    }
};

// PUT api
const updateTask = async (req, res) => {
    try {

        const task = await taskModel.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(401).json({ message: "Unauthorized: Access Denied" });
        }

        // check the id (validation)
        // req.params.id - model using find();
        // if(!req.params.id) return 404 task not found

        const updatedTask = await taskModel.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        );
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: "Task Updation Failed" })
    }
};

// DELETE api
const deleteTask = async (req, res) => {
    try {

        const task = await taskModel.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(401).json({ message: "Unauthorized: Access Denied" });
        }

        // check the id (validation)
        // req.params.id - model using find();
        // if(!req.params.id) return 404 task not found

        await taskModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Task Deletion Failed" });
    }
};

module.exports = { allTasks, createTask, updateTask, deleteTask }