import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
	// types   : [{
	// 	type: ObjectId, 
	// 	ref : 'classify',
	// }],
	title    : String,
    type     : Number,
	content  : String,
	remark   : String,
    videoUrl : String,
    segments : Array,//分段信息
	comments : Array,//评价信息, 理论上应该放在服务器 不在乎这几个的传输消耗
	status   : Number,
    create_at: {
		type   : Date,
		default: Date.now(),
	},
	update_at: Date
})

export default mongoose.model('study', Schema)