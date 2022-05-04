import UserModel from '../models/user'
import UserGradeModel from '../models/user_score'

class Common{
	constructor(model, scoreModel) {
		Object.assign(this, {
			model,
			scoreModel,
		})
	}

	/**
	 * 新建一个用户
	 * @param  {Object} body 
	 * @return {Function}          
	 */
	newAndSave(body) {
		return new this.model(body).save()
	}

	/**
	 * 根据用户名查询一个用户
	 * @param  {String}   username 
	 * @return {Function}            
	 */
	findByName(username) {
		return this.model.findOneAsync({
			username: username
		})
	}

	addScore() {
		//
	}
}

export default new Common(UserModel, UserGradeModel)