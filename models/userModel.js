const mongoose = require('mongoose')
const crypto = require('crypto')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const { reset } = require('nodemon')
// name , email , photo , password , passwordConfirm

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please tell us your name!'],
    },
    email :{
        type: String,
        required: [true,'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail]
    },
    role:{
       type:String,
       enum:['user','guide','lead-guide','admin'],
       default:'user',
    },
    photo:{
        type: String,
        default: 'default.jpg',
        //required: [true,'A tour must have a durations!'],
    },
    password:{
        type: String,
        required: [true,'Please provide a password'],
        minlength: 8,
        select:false,
    },
    passwordConfirm:{
        type: String,
        required: [true,'Please confirm your password'],
        // This only works on SAVE !!!
        validate: {
            validator:function(el){
                return el === this.password
            },
             
            message: 'Passwords are not the same'  
        }
    },
    active:{
        type: Boolean,
        default: true,
        select:false,
    },
    passwordChangedAt : Date,
    passwordResetToken: String,
    passwordResetExpires: Date
    
})


userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined
    next() 
})

userSchema.pre('save',function(next){
    if(!this.isModified('password')|| this.isNew) return next()
    this.passwordChangedAt = Date.now()-1000
    next()
})


userSchema.pre(/^find/,function(next){
    this.find({active: {$ne:false}})
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        return JWTTimestamp < changedTimestamp 
    }
    //False means not changed
    return false
}


userSchema.methods.createPasswordResetToken = function (){
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    console.log({resetToken},this.passwordResetToken)
    this.passwordResetExpires = Date.now()+10*60*1000
    
    return resetToken
}

const User = mongoose.model('User',userSchema)

module.exports = User