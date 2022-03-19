import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
	title    : String,
    type     : Number,
	remark   : String,
    description: String,
	questions: [{
		type: ObjectId, 
		ref : 'questions',
	}],
	create_at: {
		type   : Date,
		default: Date.now(),
	},
	update_at: Date,
})

export default mongoose.model('suites', Schema)