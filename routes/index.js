import common from '../controllers/common'
import qiniu from '../controllers/qiniu'
import banner from '../controllers/banner'
import classify from '../controllers/classify'
import goods from '../controllers/goods'
import cart from '../controllers/cart'
import address from '../controllers/address'
import order from '../controllers/order'
import help from '../controllers/help'
import user from '../controllers/user'
import questions from '../controllers/questions'
import match from '../controllers/match'
import study from '../controllers/study'
import pintu from '../controllers/pintu'
export default function(app) {
	new common(app)
	new qiniu(app)
	new banner(app)
	new classify(app)
	new goods(app)
	new cart(app)
	new address(app)
	new order(app)
	new help(app)
	new user(app)
	new questions(app)
	new match(app)
	new study(app)
	new pintu(app)
}