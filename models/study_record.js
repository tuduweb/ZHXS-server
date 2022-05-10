import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema({
    studyId  : {
        	type: ObjectId, 
        	ref : 'study',
        },
    segId    : Number,
    type     : Number,
    voiceUrl : String,
    grade    : Number,
	comment  : String,
	//status   : Number,
    create_at: {
		type   : Date,
		default: Date.now(),
	}
})

export default mongoose.model('study_record', Schema)