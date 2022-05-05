import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
	user     : {
		type: ObjectId, 
		ref : 'user',
	},
    openid   : String,
    remark   : String,
	create_at: {
		type   : Date,
		default: Date.now(),
	},
    
    last_login: Date,

    state: Number,

	update_at: Date,
})

export default mongoose.model('user_wechat', Schema)