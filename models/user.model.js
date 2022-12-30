const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bitcoinAddress: {
        type:String,
    },
    liteAddress: {
        type:String
    },
    ethAddress: {
        type:String
    },
    tetherAddress: {
        type:String
    },
    balance: {
        type: Number,
        default: 0
    },
    referral: {
        type: Number,
    },
    referralCode: {
        type: Number,
    },
    withdraw: [{
        type: mongoose.Types.ObjectId,
        ref: "withdrawal"
    }],
    plans:[{
        type: mongoose.Types.ObjectId,
        ref: "plan"                    
    }]


},{timestamps: true})

const withdrawalsSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user" 
    },

    amount: {
        type: Number,
        required: true
    },
    paymentMethod:{
        type: String,
        required: true
    },
    address:{
        type: String,
    
    }

    
},{timestamps: true})


const plansSchema = new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "user"    
    
    },
    planName: {
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true,
    },
    roi:{
        type: Number,
    },

    days:{
        type: Number,
    },
    profit: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    isPending:{
        type: String,
        required: true
        
    },
    isMined:{
        type: Number,
        default: 0
    },
    isCurrent:{
        type: String,
        required: true
        
    },
   

}, {timestamps: true})

//  statics signup method
userSchema.statics.signup = async function (name, email, password, bitcoinAddress, liteAddress, ethAddress, tetherAddress, referral, referralCode ) {

    // validation
    if (!email || !password){
        throw Error('All fields must be filled')
    }
    if(!bitcoinAddress && !liteAddress && !ethAddress && !tetherAddress){
        throw Error('Please add an address for you withdrawals')
    }

    if (!validator.isEmail(email)){
        throw Error('Email is not valid')
    }


    const user = await this.findOne({ email })
    if(user){
        throw Error('Email already in use')
    }

    // const salt = await bcrypt.genSalt(10)
    // const hashpassword  = await bcrypt.hash(password, salt) 
    const newUser = await this.create({name, email, password, bitcoinAddress, liteAddress, ethAddress, tetherAddress, referral, referralCode })
    return newUser

}

// statics login method
userSchema.statics.login = async function (email, password) {

    // validation
    if (!email ||!password){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ email })
    if(!user){
        throw Error('invalid user')
    }

    const match = ( user.password )
    if(!match){
        throw Error('invalid user')
    }

    return user
}

const User = mongoose.model('user', userSchema)
const Withdrawal = mongoose.model('withdrawal', withdrawalsSchema)
const Plan = mongoose.model('plan', plansSchema)

module.exports = {
    User,
    Withdrawal,
    Plan
}