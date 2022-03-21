import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
    suite    : {
		type: ObjectId, 
		ref : 'suite',
	},
    type     : Number,
	remark   : String,
	create_at: {
		type   : Date,
		default: Date.now(),
	},
	finish_at: Date,
	userChoices: Array,
	grade: {
		type   : Number,
		default: -1,
	},
	state: {
		type   : Number,
		default: 0,
	},
    owner: [{
		type: ObjectId, 
		ref : 'user',
	}],
	update_at: Date,
})

export default mongoose.model('match', Schema)