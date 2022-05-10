import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
	title    : String,
    shortname: String,

    type     : Number,
	remark   : String,
    content  : String,

    imageUrl : String,
    thumbUrl : String,

    status   : Number,

	create_at: {
		type   : Date,
		default: Date.now(),
	},
	update_at: Date,
})

export default mongoose.model('pintu', Schema)