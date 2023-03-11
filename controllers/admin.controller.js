
const { User, Withdrawal, Plan } = require("../models/user.model");



// Get all users
const getUsers = async (req, res) => { 
    try {
        const users = await User.find()
    res.status(200).json(users)
        
    } catch (error) {
        res.status(404).json({message: error.message})
        
    }

}

// Get a specific user
const getUser = async (req, res) => { 
    const id = req.params.id
    try {
        const user = await User.findById(id)
    res.status(200).json(user)
        
    } catch (error) {
        res.status(404).json({message: error.message})
        
    }

}

// Update user
const updateUser = async (req,res) =>{
    const id = req.params.id
     try {
         const user = await User.findOneAndUpdate({_id: id}, {...req.body})
        res.status(200).json({ user })
        
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
    }
}


// Get pending plans
const pendingPlans = async (req,res) =>{
     try {
         const plans = await Plan.find({isPending: 'yes'})
        res.status(200).json({ plans })
        
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
    }
 }

// Get plan by id
const plan = async (req,res) =>{
    const id = req.params.id
     try {
         const plans = await Plan.findById(id)
        res.status(200).json({ plans })
        
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
    }
}
 
// Update  plan by id
const updatePlan = async (req,res) =>{
    const id = req.params.id
     try {
         const plans = await Plan.findOneAndUpdate({_id: id}, {...req.body})
         res.status(200).json({ plans })
        
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
    }
}
 
// Get current plans
const currentPlans = async (req,res) =>{
    try {
        const plans = await Plan.find({isCurrent: 'yes'})
       res.status(200).json({ plans })
       
   } catch (error) {
       res.status(400).json({message: error.message})
       console.log(error)
   }
}

// update current plans
const updateCurrentPlan = async (req,res) =>{
    const id = req.params.id
    const {userId, total, isCurrent, isMined} = req.body
    try {
        const plans = await Plan.findOneAndUpdate({_id: id}, {isCurrent, isMined})
        const user = await User.findOne({ _id: userId })
         user.balance = user.balance + total
        await user.save()
         res.status(200).json({ plans })
        
    } catch (error) {
        res.status(400).json({message: error.message})
        console.log(error)
    }
}










module.exports = {
    getUsers,
    getUser,
    updateUser,
    pendingPlans,
    plan,
    updatePlan,
    currentPlans,
    updateCurrentPlan,
    // minedPlans,
    // minedPlan,

}

