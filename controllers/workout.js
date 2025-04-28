const Workout = require('../models/Workout');
const { errorHandler } = require('../auth');

// Add workout
exports.addWorkout = (req, res) => {
    const newWorkout = new Workout({
        name: req.body.name,
        duration: req.body.duration,
        userId: req.user.id,
        status: "Pending",
        dateAdded: new Date()
    });

    newWorkout.save()
    .then(workout => {
        return res.status(201).send({ workout });
    })
    .catch(err => errorHandler(err, req, res));
};


// Get user's workouts
exports.getMyWorkouts = (req, res) => {
    Workout.find({ userId: req.user.id })
    .then(workouts => {
        return res.status(200).send({ workouts });
    })
    .catch(err => errorHandler(err, req, res));
};


// Update workout
exports.updateWorkout = (req, res) => {
    const workoutId = req.params.workoutId;

    Workout.findOneAndUpdate(
        { _id: workoutId, userId: req.user.id },
        { name: req.body.name, duration: req.body.duration },
        { new: true }
    )
    .then(workout => {
        if (!workout) return res.status(404).send({ error: "Workout not found" });
        res.status(200).send({ message: "Workout updated successfully", workout });
    })
    .catch(err => errorHandler(err, req, res));
};

// Delete workout
exports.deleteWorkout = (req, res) => {
    const workoutId = req.params.workoutId;

    Workout.findOneAndDelete({ _id: workoutId, userId: req.user.id })
    .then(workout => {
        if (!workout) {
            return res.status(404).send({ error: "Workout not found or unauthorized" });
        }
        return res.status(200).send({ message: "Workout deleted successfully" });
    })
    .catch(err => errorHandler(err, req, res));
};


// Mark as complete
exports.completeWorkoutStatus = (req, res) => {
    const workoutId = req.params.workoutId;

    Workout.findOneAndUpdate(
        { _id: workoutId, userId: req.user.id },
        { status: "Completed" },
        { new: true }
    )
    .then(workout => {
        if (!workout) return res.status(404).send({ error: "Workout not found" });
        res.status(200).send({ message: "Workout marked as completed", workout });
    })
    .catch(err => errorHandler(err, req, res));
};