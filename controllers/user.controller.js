const jwt = require('jsonwebtoken')
const { User, PendingPlan, CurrentPlan, MinedPlan, Withdrawal, Plan } = require("../models/user.model");


// create token function

const createToken = (_id) => {
 return jwt.sign({_id},process.env.SECRET_KEY, {expiresIn: '3days'})

}

 const signup = async (req ,res) => {
    const {name, email, password, bitcoinAddress, liteAddress, ethAddress} = req.body

    try {
        
        const user = await User.signup(name, email, password, bitcoinAddress, liteAddress, ethAddress)
// create token
    const token = createToken(user._id)

        res.status(200).json({token, user:name, id:user._id})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

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


const createMining = async (req,res) => {
    const { userId, planName, amount, profit, total, roi, days, paymentMethod} = req.body
    try {
        const user = await User.findOne({_id: userId})
        if(user){
            const plan = new Plan ({ user, userId, planName, amount, profit, total, roi, days, paymentMethod })
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

 const pendingPlans = async (req,res) =>{
    const id = req.params.id
    try {
        const user = await User.findOne({_id: id})
            .populate({
                path:"plans",
                match: { isPending: 1}
        })
                const pendingPlans = user.plans
            
        res.status(200).json({pendingPlans})
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
    }
 }


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



 const currentPlans = async (req,res) =>{
    const id = req.params.id
    try {
        const user = await User.findOne({_id: id})
            .populate({
                path:"plans",
                match: { isCurrent: 1}
        })
                const currentPlans = user.plans
            
        res.status(200).json({currentPlans})
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
    }
 }



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
    createMining,
    currentPlans,
    pendingPlans,
    minedPlans,
    userInfo,
    withdraw,
    totalWithdraw
    
}
