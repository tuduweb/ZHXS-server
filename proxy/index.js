import RestBase from './RestBase'
import banner from '../models/banner'
import classify from '../models/classify'
import goods from '../models/goods'
import cart from '../models/cart'
import address from '../models/address'
import order from '../models/order'
import help from '../models/help'
import questions from '../models/questions'
import match from '../models/match'
import suite from '../models/suite'
import study from '../models/study'

import user from './user'
import upload from './upload'

import user_relation from '../models/user_relation'
import user_score from '../models/user_score'
import voice from '../models/voice'

export default {
	banner  : new RestBase(banner), 
	classify: new RestBase(classify), 
	goods   : new RestBase(goods), 
	cart    : new RestBase(cart), 
	address : new RestBase(address), 
	order   : new RestBase(order), 
	help    : new RestBase(help),
	questions: new RestBase(questions),
	match   : new RestBase(match),
	suite	: new RestBase(suite),
	study	: new RestBase(study),
	user_relation: new RestBase(user_relation),
	user_score: new RestBase(user_score),
	voice: new RestBase(voice),

	user    : user, 
	upload  : upload, 
}