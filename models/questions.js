import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
	// types   : [{
	// 	type: ObjectId, 
	// 	ref : 'classify',
	// }],
	title    : String,
    type     : Number,
	remark   : String,
    content  : String,
	options  : Array,//选项
    answer   : Array,
	create_at: {
		type   : Date,
		default: Date.now(),
	},
	update_at: Date,
})

export default mongoose.model('questions', Schema)