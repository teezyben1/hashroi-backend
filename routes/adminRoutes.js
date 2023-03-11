const express = require('express');
const {  pendingPlans, plan, currentPlans, currentPlan, minedPlans, minedPlan, getUsers, getUser, updateUser, updatePlan, updateCurrentPlan } = require('../controllers/admin.controller');
const admin = express.Router();



// get users
admin.get('/users', getUsers);
admin.get('/users/:id', getUser);
admin.post('/user/:id', updateUser);



// admin requesting for pending plans
admin.get('/pending-plans', pendingPlans);
// admin getting one plan
admin.get('/plan/:id', plan);
// admin updating one plan
admin.post('/plan/:id', updatePlan);


// user requesting for active plans
admin.get('/current-plans', currentPlans);
admin.post('/update-current-plan/:id', updateCurrentPlan);
// user requesting for mined plans
// admin.get('/mined-plans', minedPlans);
// admin.get('/mined-plans/:id', minedPlan);




module.exports = admin

