const express = require('express');
const { signup, login, updatePassword, createMining, pendingPlans, currentPlans, minedPlans, userInfo, withdraw, emailMgs, getUsers, totalWithdraw, } = require('../controllers/user.controller');
const user = express.Router();

// user creating account
user.post('/signup', signup);
// user logging in
user.post('/login', login);
// update password
user.post('/newPassword', updatePassword);
// get user info
user.get('/user-info/:id',  userInfo)
// user creating a mining plan
user.post('/create-mining',  createMining)
// user requesting withdrawal
user.post('/withdraw', withdraw)
// user requesting for pending plans
user.get('/pending-plans/:id', pendingPlans);
// user requesting for active plans
user.get('/current-plans/:id',  currentPlans);
// user requesting for mined plans
user.get('/mined-plans/:id',  minedPlans);
// user requesting for total withdrawals
user.get('/withdrawals/:id', totalWithdraw);
// custom mail route
user.post('/email', emailMgs)
// // get users
user.get('/users', getUsers);



module.exports = user

