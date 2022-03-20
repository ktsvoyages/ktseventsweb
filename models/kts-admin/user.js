const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    
    name:{
        type: String,
        required:true,
        min:6,
        max:200
    },
    email: {
        type: String, 
        required: [true, 'Username cant be blank'],
        min: 4
    },
    password:{
        type: String,
        required: [true, 'Password cant be blank'],
        min:6
    }
})

module.exports = mongoose.model('User', userSchema)