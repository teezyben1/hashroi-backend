const jwt = require('jsonwebtoken')
const { User, Withdrawal, Plan } = require("../models/user.model");


// create token function
const createToken = (_id) => {
 return jwt.sign({_id},process.env.SECRET_KEY, {expiresIn: '3days'})

}
// Signup
 const signup = async (req ,res) => {
    const {name, email, password, bitcoinAddress, liteAddress, ethAddress, tetherAddress,referral, totalReferral,referralBonus} = req.body
    const referralCode = Math.floor(Math.random() * 43576)
    try {
        // Run if there is no referral 
        if(!referral){
            // Create a new user without a referral 
            const user = await User.signup(name, email, password, bitcoinAddress, liteAddress, ethAddress, tetherAddress, referral, referralCode, totalReferral,referralBonus )
            // create token
                const token = createToken(user._id)
                res.status(200).json({token, user:name, id:user._id})
        }
        // Run if there is a referral
        if(referral){
            // Find the referral
            const userReferral = await User.findOne({referralCode:referral})
            // 
            if(!userReferral || userReferral.referralCode != referral){
                throw Error('invalid referral code')
            }else{
                userReferral.totalReferral = userReferral.totalReferral + 1
                // userReferral.referralBonus = userReferral.referralBonus + (Math.floor(7 / 100 * amount))
            }
            const user = await User.signup(name, email, password, bitcoinAddress, liteAddress, ethAddress, tetherAddress, referral, referralCode, totalReferral,referralBonus )
            // create token
                const token = createToken(user._id)
                res.status(200).json({token, user:name, id:user._id})
           
            await userReferral.save()
        }

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

// Login 
const login = async (req,res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)

        res.status(200).json({token, user:user.name, id: user._id})
    
        
    } catch (error) {
        res.status(400).json({message: error.message})
        
    }
}
// Updating  user password
const updatePassword = async (req,res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({email})

        if(!user){
            throw Error('this email is not registered')
            
        }

        if(user){
            user.password = password
            await user.save()
            res.status(200).json({ user:user.name, id: user._id})
        }

    
        
    } catch (error) {
        res.status(400).json({message: error.message})
        
    }
}

// Creating new mining plan
const createMining = async (req,res) => {
    const { userId, planName, amount, profit, total, roi, days, paymentMethod, isCurrent, isPending} = req.body
    try {
        const user = await User.findOne({_id: userId})
        if(user){
            const plan = new Plan ({ user, userId, planName, amount, profit, total, roi, days, paymentMethod, isCurrent, isPending })
            if(paymentMethod === 'BAL'){
                user.balance = user.balance - amount 
            }
            user.plans.push(plan._id)
           await user.save()
           await plan.save()
        res.status(200).json({plan})
        }else{ res.json({message:"you are not a user",})}
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
        
    }
}

// Get pending plans
 const pendingPlans = async (req,res) =>{
    const id = req.params.id
    try {
        const user = await User.findOne({_id: id})
            .populate({
                path:"plans",
                match: { isPending: 'yes'}
        })
                const pendingPlans = user.plans
            
        res.status(200).json({pendingPlans})
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
    }
 }

// Get user details
 const userInfo = async (req,res) =>{
    const id = req.params.id
    try {
        const user = await User.findOne({_id: id})
            .populate({
                path:"plans",
                
        })
                const plans = user.plans
            
        res.status(200).json({user,plans})
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
    }
 }


// Get current plans
 const currentPlans = async (req,res) =>{
    const id = req.params.id
    try {
        const user = await User.findOne({_id: id})
            .populate({
                path:"plans",
                match: { isCurrent: 'yes'}
        })
                const currentPlans = user.plans
            
        res.status(200).json({currentPlans})
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
    }
 }


// Get mined plans
 const minedPlans = async (req,res) =>{
    const id = req.params.id
    try {
        const user = await User.findOne({_id: id})
            .populate({
                path:"plans",
                match: { isMined: 1}
        })
                const minedPlans = user.plans
        res.status(200).json({minedPlans})
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
    }
 }

//  Request for withdrawal
 const withdraw = async(req,res) => {
    const {userId, amount,paymentMethod,address} = req.body
    try {
      const  user = await User.findOne({_id:userId})
        if(user){
            user.balance = user.balance-amount

            const withdraw = new Withdrawal({amount,paymentMethod,address})
            user.withdraw.push(withdraw)
            await user.save()
            await withdraw.save()
            res.status(200).json({message: 'withdraw success',})
        }
        
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
        
        
    }
 }
// Get total withdrawals
const totalWithdraw = async(req, res) => {
    const id = req.params.id
    try {
        const user = await User.findOne({_id: id})
            .populate({
                path:"withdraw",
                
        })
                const totalWithdraw = user.withdraw
            
        res.status(200).json({totalWithdraw})
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
    }

}


module.exports = {
    signup,
    login,
    updatePassword,
    createMining,
    currentPlans,
    pendingPlans,
    minedPlans,
    userInfo,
    withdraw,
    totalWithdraw
    
}
