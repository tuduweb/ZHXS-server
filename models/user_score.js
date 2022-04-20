import mongoose from 'mongoose'

const Schema = mongoose.Schema({
	userid   : {
		type: ObjectId, 
		ref : 'user',
	},
    scoreType: Number,
    score    : Number,
    dataSrc  : Number,
    scoreStat: Number,
    dataId   : ObjectId,
    remark   : String,
	create_at: {
		type   : Date,
		default: Date.now(),
	},
	update_at: Date,
})

export default mongoose.model('user_score', Schema)