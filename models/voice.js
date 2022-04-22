import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
	studyId  : {
		type: ObjectId, 
		ref : 'study',
	},
	segId    : Number,

    voicePath: String,
	userId   : {
		type: ObjectId, 
		ref : 'user',
	},

	grade    : Number,
	commentId: Number,

	type     : Number,

	remark   : String,
	create_at: {
		type   : Date,
		default: Date.now(),
	},
})

export default mongoose.model('voice', Schema)