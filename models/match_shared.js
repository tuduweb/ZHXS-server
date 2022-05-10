import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
    type     : Number,
	remark   : String,
	create_at: {
		type   : Date,
		default: Date.now(),
	},
	status: {
		type   : Number,
		default: 0,
	},
    creator:{
		type: ObjectId, 
		ref : 'user',
	},
    matchId: {
		type: ObjectId, 
		ref : 'match',
    },
	update_at: Date,
})

export default mongoose.model('match_shared', Schema)