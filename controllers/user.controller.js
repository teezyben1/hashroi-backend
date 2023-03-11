const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

const { User, Withdrawal, Plan } = require("../models/user.model");


// create token function
const createToken = (_id) => {
 return jwt.sign({_id},process.env.SECRET_KEY, {expiresIn: '3days'})
}

// Email setup
let transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'support@hashroi.online', // generated ethereal user
      pass: '12345678', // generated ethereal password
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views'),
    extName: ".handlebars",
  }

  transporter.use('compile', hbs(handlebarOptions));

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing  
    // create reusable transporter object using the default SMTP transport
   





// Signup
 const signup = async (req ,res) => {
     const { name, email, password, bitcoinAddress, liteAddress, ethAddress, tetherAddress, referral, totalReferral, referralBonus } = req.body
     //Generate a referralCode
    const referralCode = Math.floor(10000 + Math.random() * 43576)
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
                const user = await User.signup(name, email, password, bitcoinAddress, liteAddress, ethAddress, tetherAddress, referral, referralCode, totalReferral,referralBonus )
                // create token
                const token = createToken(user._id)
                res.status(200).json({token, user:name, id:user._id})
            }
            await userReferral.save()

        }

        // Send email after signup
                transporter.sendMail({
                    from: 'support@hashroi.online', // sender address
                    to: [email, 'support@hashroi.online'], // list of receivers'
                    subject: 'Welcome To Hashroi Online',
                    template: 'email',
                    context: {
                          title: 'Lets Mine Together',
                          text1:`Dear ${name},`,
                          text: `Thank you for choosing Hashroi online as your mining platform your profit is our concern.Choose a       preferable mining plan to start mining,`,
                          text2:'More Mining More Profit!',
                          title3: 'Happy mining!',     
                    }
                    
                  },function (err,info){
                    if(err){
                        console.log(err);
                        return
                    }
                    console.log('Success' + info.response)
                  });

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
    const { userId, planName, amount, profit, total, roi, days, paymentMethod, isCurrent, isPending, trxnId } = req.body
    const miningId = Math.floor(1000000 + Math.random() * 43576)

    try {
        const user = await User.findOne({_id: userId})
        if(user){
            const plan = new Plan ({ user, userId, planName, amount, profit, total, roi, days, paymentMethod, isCurrent, isPending,trxnId,miningId })
            if(paymentMethod === 'BAL'){
                user.balance = user.balance - amount 
            }
            user.plans.push(plan._id)
           await user.save()
           await plan.save()
        res.status(200).json({plan})

        
      
           transporter.sendMail({
              from: 'support@hashroi.online', // sender address
              to: [user.email, 'support@hashroi.online'], // list of receivers'
              subject: 'New Mining Created!',
              template: 'email',
              context: {
                    title: planName,
                    text1:`Dear ${user.name},`,
                  text: `Thank you for mining with hashroi.online,Your profit is our concern. Mining will be activated once your payment is approved,`,
                  text5:`Your mining id: ${miningId}`,
                  text4: `Your transaction id: ${trxnId}`,
                    text2:'More Mining More Profit!',
                    title3: 'Happy mining!',

            }
            },function (err,info){
              if(err){
                  console.log(err);
                  return
              }
              console.log('Success' + info.response)
            });


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
         const user = await User.findOne({ _id: id })
             .populate({
                 path: "plans",
                 match: { isPending: 'yes' },
                 options:{sort:[{'createdAt': 'desc'}]}
        })
        const pendingPlans = user.plans
        
        
            
        res.status(200).json({ pendingPlans })
        
        

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
                match: { isCurrent: 'yes' },
                options:{sort:[{'createdAt': 'desc'}]}
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
                match: { isMined: 1 },
                options:{sort:[{'createdAt': 'desc'}]}
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
        }
        res.status(200).json({message: 'withdraw success',})
            
            transporter.sendMail({
                from: 'support@hashroi.online', // sender address
                to: [user.email, 'support@hashroi.online'], // list of receivers'
                subject: ' Withdrawal Request',
                template: 'email',
                context: {
                      title: 'Keep Mining! ',
                      text1:`Dear ${user.name},`,
                      text: `Thank you for choosing Hashroi online.Your withdrawal request has been sent $${amount} worth of ${paymentMethod} will be sent to you address once approved,`,
                      text2:'More Mining More Profit!',
                      title3: 'Happy mining!',
    
              }
              },function (err,info){
                if(err){
                    console.log(err);
                    return
                }
              });
        }

        
     catch (error) {
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

const emailMgs = (req, res) => {
    const { email, name, subject, text1, text2, text3 } = req.body
    try {
        transporter.sendMail({
            from: 'support@hashroi.online', // sender address
            to: [email, 'support@hashroi.online'], // list of receivers'
            subject: subject,
            template: 'customMail',
            context: {
                  
                  title:`Dear ${name},`,
                text1: text1 ,
                text2: text2,
                text3:text3,  
                  text4:'More Mining More Profit!',
                  text5: 'Happy mining!',

          }
          },function (err,info){
            if(err){
                console.log(err);
                return
            }
            console.log('Success' + info.response)
            res.status(200).json('success')
        });
    } catch (error) {
        res.status(400).json({message: error.message})
        
    }
}

const getUsers = async (req, res) => { 
    try {
        const users = await User.find()
    res.status(200).json(users)
        
    } catch (error) {
        res.status(404).json({message: error.message})
        
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
    totalWithdraw,
    emailMgs,
    getUsers
}
