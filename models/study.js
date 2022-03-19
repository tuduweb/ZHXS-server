import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
	// types   : [{
	// 	type: ObjectId, 
	// 	ref : 'classify',
	// }],
    type     : Number,
	remark   : String,
    videoUrl : String,
    segments : Array,//分段信息
    create_at: {
		type   : Date,
		default: Date.now(),
	},
	update_at: Date
})

export default mongoose.model('study', Schema)