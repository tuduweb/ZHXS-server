import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
	userid   : {
		type: ObjectId, 
		ref : 'user',
	},
	parentId : {
		type: ObjectId, 
		ref : 'user',
	},
    refSrc   : String,
    refTime  : Date,
    dataId   : ObjectId,
    remark   : String,
	create_at: {
		type   : Date,
		default: Date.now(),
	},
	update_at: Date,
})

export default mongoose.model('user_score', Schema)