const { Schema, model, Types} = require('mongoose')

const TodoSchema = new Schema({
   owner: {type: Types.ObjectId, ref: 'User'},
   text: {type: String, required: true},
   completed: {type: Boolean, required: true, default: false},
   timestamp: {type: Date, required: true},
})

module.exports = model('Todo', TodoSchema)