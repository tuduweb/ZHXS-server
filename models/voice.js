import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
	// types   : [{
	// 	type: ObjectId, 
	// 	ref : 'classify',
	// }],
    type     : Number,
	remark   : String,
    voiceUrl : String,
	create_at: {
		type   : Date,
		default: Date.now(),
	},
})

export default mongoose.model('voices', Schema)