import proxy from '../proxy'
import mongoose from 'mongoose'
import user_score from '../models/user_score'

class Ctrl{
	constructor(app) {
		Object.assign(this, {
			app, 
			model: proxy.match,
            suiteModel: proxy.suite,
            questionsModel: proxy.questions,
			userScoreModel: proxy.user_score,
			userModel: proxy.user
		})

		this.init()
	}

	/**
	 * 初始化
	 */
	init() {
		this.routes()
	}

	/**
	 * 注册路由
	 */
	routes() {
		this.app.get('/api/match', this.getAll.bind(this))

		this.app.get('/api/match/scoreup/demo', this.scoreDemo.bind(this))


		this.app.post('/api/match/score/demo', this.postScore.bind(this))
		this.app.get('/api/match/score/demo', this.getScore.bind(this))

		this.app.get('/api/match/start', this.start.bind(this))
		this.app.get('/api/match/start/:typeId', this.start.bind(this))
		this.app.post('/api/match/submit', this.submit.bind(this))
		
		this.app.get('/api/match/detail/demo/:id', this.detail.bind(this))
		this.app.get('/api/match/detail/:id', this.detail.bind(this))

		this.app.get('/api/match/score/:id', this.showScore.bind(this))

		this.app.get('/api/match/generate', this.generate.bind(this))
		this.app.get('/api/match/:id', this.get.bind(this))
		this.app.post('/api/match', this.post.bind(this))
		this.app.put('/api/match/:id', this.put.bind(this))
		this.app.delete('/api/match/:id', this.delete.bind(this))



	}

	getScore(req, res, next) {
		const body = {
			user: mongoose.Types.ObjectId('626282b26a769711c6dfbb63'),
			scoreType: 0,
			score: 100,
			scoreType: 999,
			scoreStat: 0,
			remark: "系统测试" + Date.now(),
		}

		this.userScoreModel.post(body)
		.then(doc => {
			if(!doc) {}
			return res.tools.setJson(0, 'success', doc)
		})
		.catch(err => res.tools.setJson(1, 'error', err))
	}


	postScore(req, res, next) {


		//userScoreModel.model // mongoose.Types.ObjectId(

		const params = {
			query  : {
				user: '626282b26a769711c6dfbb63'
			},
			fields : {},
			options: {},
		}

		const options = {
			path    : 'user', 
			select  : {}, 
		}

		this.userScoreModel.model.findOne(params.query, params.fields)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
			return res.tools.setJson(0, '调用成功', doc)
		})
		.catch(err => next(err))
	
		//return res.tools.setJson(0, "ok", []);
	
	}

	/**
	 * @apiDefine Header
	 * @apiHeader {String} Authorization jsonwebtoken
	 */
	
	/**
	 * @apiDefine Success
	 * @apiSuccess {Object} meta 状态描述
	 * @apiSuccess {Number} meta.code 标识码，0表示成功，1表示失败
	 * @apiSuccess {String} meta.message 标识信息
	 * @apiSuccess {Object} data 数据内容
	 */
	
	/**
	 * @api {get} /goods 列出所有资源
	 * @apiDescription 列出所有资源
	 * @apiName getAll
	 * @apiGroup goods
	 * 
	 * @apiParam {String} [page=1] 指定第几页
	 * @apiParam {String} [limit=10] 指定每页的记录数
	 *
	 * @apiPermission none
	 * @apiSampleRequest /goods
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "调用成功"
	 *       },
	 *       "data": [{
	 *       	"_id": "_id",
	 *       	"name": "name",
	 *       	"price": "price",
	 *       	"remark": "remark",
	 *       	"images": "images",
	 *       	"types": "types",
	 *       	"create_at": "create_at",
	 *       	"update_at": "update_at"
	 *       }]
	 *     }
	 */	
	getAll(req, res, next) {
		const query = {
			owner: req.user.id
		}

		const opts = {
			page : req.query.page, 
			limit: req.query.limit
		}

		if (req.query.type) {
			query.types = req.query.type
		}

		if (req.query.keyword) {
			query.name = req.query.keyword
		}

		const options = {
			path    : 'types', 
			select  : {}, 
		}

		const field = {

		}

		Promise.all([
			this.model.countAsync(query), 
			this.model.getAll(query, field, options), 
		])
		.then(docs => {
			res.tools.setJson(0, '调用成功', {
				items   : docs[1], 
				paginate: res.paginate(Number(opts.page), Number(opts.limit), docs[0]), 
			})
		})
		.catch(err => next(err))
	}
	
	/**
	 * @api {get} /goods/:id 获取某个指定资源的信息
	 * @apiDescription 获取某个指定资源的信息
	 * @apiName get
	 * @apiGroup goods
	 *
	 * @apiParam {String} id 资源ID
	 *
	 * @apiPermission none
	 * @apiSampleRequest /goods/:id
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "调用成功"
	 *       },
	 *       "data": {
	 *       	"_id": "_id",
	 *       	"name": "name",
	 *       	"price": "price",
	 *       	"remark": "remark",
	 *       	"images": "images",
	 *       	"types": "types",
	 *       	"create_at": "create_at",
	 *       	"update_at": "update_at"
	 *       }
	 *     }
	 */
	get(req, res, next) {
		const params = {
			query  : {
				_id: req.params.id
			},
			fields : {}, 
			options: {}, 
		}

		const options = {
			path    : 'types', 
			select  : {}, 
		}

		this.model.findOneAndPopulateAsync(params, options)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
			return res.tools.setJson(0, '调用成功', doc)
		})
		.catch(err => next(err))
	}

	/**
	 * @api {post} /goods 新建一个资源
	 * @apiDescription 新建一个资源
	 * @apiName post
	 * @apiGroup goods
	 *
	 * @apiParam {String} name 名称
	 * @apiParam {Number} price 价格
	 * @apiParam {String} remark 简介
	 * @apiParam {Array} images 图片
	 * @apiParam {Array} types 分类
	 *
	 * @apiPermission none
	 * @apiSampleRequest /goods
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "新增成功"
	 *       },
	 *       "data": {
	 *       	"_id": "_id"
	 *       }
	 *     }
	 */
	post(req, res, next) {
		const body = {
			name  : req.body.name, 
			price : req.body.price, 
			remark: req.body.remark, 
			images: req.body.images, 
			types : req.body.types, 
		}

		this.model.post(body)
		.then(doc => res.tools.setJson(0, '新增成功', {_id: doc._id}))
		.catch(err => next(err))
	}

	/**
	 * @api {put} /goods/:id 更新某个指定资源的信息
	 * @apiDescription 更新某个指定资源的信息
	 * @apiName put
	 * @apiGroup goods
	 *
	 * @apiParam {String} id 资源ID
	 * @apiParam {String} [name] 名称
	 * @apiParam {String} [price] 价格
	 * @apiParam {String} [remark] 简介
	 * @apiParam {Array} [images] 图片
	 * @apiParam {Array} [types] 分类
	 *
	 * @apiPermission none
	 * @apiSampleRequest /goods/:id
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "更新成功"
	 *       },
	 *       "data": {
	 *       	"_id": "_id",
	 *       	"name": "name",
	 *       	"price": "price",
	 *       	"remark": "remark",
	 *       	"images": "images",
	 *       	"types": "types",
	 *       	"create_at": "create_at",
	 *       	"update_at": "update_at"
	 *       }
	 *     }
	 */
	put(req, res, next) {
		const query = {
			_id: req.params.id
		}

		const body = {
			name  : req.body.name, 
			price : req.body.price, 
			remark: req.body.remark, 
			images: req.body.images, 
			types : req.body.types, 
		}

		this.model.put(query, body)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
			return res.tools.setJson(0, '更新成功', doc)
		})
		.catch(err => next(err))
	}

	/**
	 * @api {delete} /goods/:id 删除某个指定资源
	 * @apiDescription 删除某个指定资源
	 * @apiName delete
	 * @apiGroup goods
	 *
	 * @apiParam {String} id 资源ID
	 * @apiSampleRequest /goods/:id
	 * 
	 * @apiPermission none
	 * 
	 * @apiUse Header
	 * @apiUse Success
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *       "meta": {
	 *       	"code": 0,
	 *       	"message": "删除成功"
	 *       },
	 *       "data": null
	 *     }
	 */
	delete(req, res, next) {
		const query = {
			_id: req.params.id
		}
		
		this.model.delete(query)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
			return res.tools.setJson(0, '删除成功')
		})
		.catch(err => next(err))
	}


	// // path: data->questions->[suite]->datas->...

    start(req, res, next) {
        //权限验证

        //根据模式, 生成新的答题比赛
        
        //从套题里面获取比赛


		// this.questionsModel.model.aggregate( [ { $project: { _id: 1, title: 1 }} , { $sample: { size: 10 } } ] ).then(
		// 	docs => {
		// 		if(docs.length > 0) {
		// 			let questionIds = []
		// 			docs.forEach((item, index) => {
		// 				let {_id} = item
		// 				questionIds.push(_id)
		// 			});
		// 			console.log(questionIds)
		// 		}
		// 	})
		// 	.catch(err => console.log(err))

		// 需要限制lookup查询的元素的field
        this.suiteModel.model.aggregate( [
			{$sample: { size: 1 } },
			{$lookup: { from: "questions", localField: "questions", foreignField: "_id", as: "datas"}}
		])
        .then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')

			//console.log(doc[0].datas) //题目数据

			const body = {
				suite : doc[0]._id,
				owner: req.user._id //TypeError: Cannot read property '_id' of undefined. beacuse of QUOTE jwt middleware
			}

			console.log(body)

			this.model.post(body)
			.then(matchDoc => {

				res.tools.setJson(0, '新增挑战成功', {_id: matchDoc._id, questions: doc[0]})
			
			})
			.catch(err => next(err))

			// this.model.post()

			//return res.tools.setJson(0, '调用成功', doc)
		})
        .catch(err => next(err))
    }

	detail(req, res, next) {
		
		const query = {
			_id: req.params.id
		}
		
		const field = {
			//
		}

		// this.model.get(query, field)
		// .then(result =>{
		// 	if (!result) return res.tools.setJson(1, 'match不存在或已删除')
		// 	return res.tools.setJson(0, '调用成功', result)
		// }).catch(err => next(err))
		
		//{ _id: mongoose.Types.ObjectId(req.body.id) }
		this.model.model.aggregate( [
			{ $match: { _id: mongoose.Types.ObjectId(req.params.id) }  },
			{ $lookup: { from: "suites", localField: "suite", foreignField: "_id", as: "suiteData" } },
			{
				$unwind: {
					path: '$suiteData',
					preserveNullAndEmptyArrays: true,
				}
			},
			{
				$project: {
					_id : 1,
					state: 1,
					create_at: 1,
					'suiteData.questions': 1
				}
			},
			{ $lookup: { from: "questions", localField: "suiteData.questions", foreignField: "_id", as: "questionsData" }},
		])
		.then(result =>{
			if (!result) return res.tools.setJson(1, 'match不存在或已删除')
			//处理数据, 增加答案个数。TODO: 更新mongo版本, 把函数写到sql中
			result[0].questionsData.forEach((item, index, arr) => {
				arr[index]["answerCnt"] = item.answer.length
			})
			
			return res.tools.setJson(0, '调用成功', result[0])
		}).catch(err => next(err))
		//		//Because you are trying to use the $lookup features (syntax) from MongoDB v3.6 on MongoDB v3.4

	}

	showScore(req, res, next) {
		const _id = req.params.id

		const params = {
			query  : {
				_id: req.params.id
			},
			fields : {}, 
			options: {}, 
		}

		this.model.model.findOne(params.query, params.fields).exec()
		.then(result => {
			if (!result) return res.tools.setJson(1, 'match不存在或已删除')
			return res.tools.setJson(0, '调用成功', result)
		}).catch(err => next(err))

	}

	submit(req, res, next) {
        //权限验证

        //根据模式, 生成新的答题比赛
        
        //从套题里面获取比赛
		//为什么是req.body 而不是 req.params?
		const params = {
			query  : {
				_id: req.body.id
			},
			fields : {}, 
			options: {}, 
		}
		//TODO: 还需要加入对choices数据的判断, 需要合规数据
		let choices = req.body.choices

		//处理choices, 使之升序排列
		choices.forEach((item, index, arr) => {
			arr[index] = item.sort((a, b) => {return a - b} )
		})

		console.log("req.body", req.body)
		this.model.model.aggregate([
			{ $match: { _id: mongoose.Types.ObjectId(req.body.id) }  },
			{ $lookup: { from: "suites", localField: "suite", foreignField: "_id", as: "suiteData" } },
			{
				$unwind: {
					path: '$suiteData',
					preserveNullAndEmptyArrays: true,
				}
			},
			{
				$project: {
					_id : 1,
					state: 1,
					create_at: 1,
					'suiteData.questions': 1
				}
			},
			{ $lookup: { from: "questions", localField: "suiteData.questions", foreignField: "_id", as: "questionsData" } },

		]).then(docs => {
			if(!docs) return;

			console.log("appgregate", docs)
		
			//console.log(docs[0].questionsData)

			//判断题目正确与否
			//TODO: 需要加入评分策略, 对于多选题有效
			let trueCnt = 0, falseCnt = 0
			docs[0].questionsData.forEach((item, index) => {
				//console.log(item.answer)
				//可能需要sort
				console.log(index, item.answer.join(","), choices[index].join(","))
				if (item.answer.join(",") == choices[index].join(",")) { trueCnt++ }
				else { falseCnt++ }
			})
			//计算成绩
			let _grade = 100 / docs[0].questionsData.length * trueCnt * 100

			//更新成绩到数据中, 并操作积分表, 给分

			const query = {
				_id: req.body.id
			}
	
			const body = {
				userChoices : req.body.choices,
				grade: _grade,
				finish_at: Date.now(),
				state : 2
			}

			this.model.put(query, body)
			.then(doc => {
				if (!doc) return res.tools.setJson(1, '保存结果失败!请联系管理员。')
				//return res.tools.setJson(0, '更新成功', doc)

				const scoreBody = {
					user: req.user.id,
					score: 10,
					scoreStat: 0,
					scoreType: 10,
					remark: "用户完成竞赛，奖励积分。"
				}
		
				this.userScoreModel.post(scoreBody)
				.then(doc => {
					if (!doc) console.log("更新积分表失败", scoreBody)
					else console.log("更新积分表成功", scoreBody)
				})
				.catch(err => console.log(err))


				this.userModel.findByName(req.user.username).then(doc => {
					if (doc) {
						doc.score = doc.score + 10
						doc.save()
					}
				})
				// const userBody = {
				// 	user: req.user.id,
				// 	score: 10,
				// 	scoreStat: 0,
				// 	scoreType: 10,
				// 	remark: "用户完成竞赛，奖励积分。"
				// }
				
				const result = {
					_id: docs[0]._id,
					_doc: docs[0],
					grade: _grade
				}
	
				return res.tools.setJson(0, '调用成功', result)
			
			})
			.catch(err => next(err))


		}).catch(err => next(err))

		// this.model.model.findOne(params.query, params.fields).exec().then(doc => {
		// 	if (!doc) return res.tools.setJson(1, '该match记录不存在')

		// 	const query = {
		// 		_id: req.body.id
		// 	}
	
		// 	const body = {
		// 		choices : req.body.choices,
		// 		finish_at: Date.now(),
		// 		state : 2
		// 	}


		// 	const result = {
		// 		_id: doc._id,
		// 		_doc: doc,
		// 		grade: 9900
		// 	}

		// 	return res.tools.setJson(0, '调用成功', result)
		// }).catch(err => next(err))


		// this.model.put(query, body)
		// .then(doc => {
		// 	if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
		// 	return res.tools.setJson(0, '更新成功', doc)
		// })
		// .catch(err => next(err))

	
	
	}

	generate(req, res, next) {

		//当前的东西按分类，所以需要按分类抽取.. 给每个用户不同的题目? Q:去重问题

		const body = {
			type : 1
		}

		this.questionsModel.model.aggregate( [ { $project: { _id: 1, title: 1 }} , { $sample: { size: 10 } } ] ).then(
			docs => {
				
				if(docs.length < 10) {
					res.tools.setJson(0, '问题数量不够')
				}else{

					let questionIds = []
					docs.forEach(item => {
						let {_id} = item
						questionIds.push(_id)
					});

					console.log(questionIds)

					const body = {
						title  : "套题标题" + Math.random()*1000, 
						type : 3, 
						remark: "remark",
						questions: questionIds
					}

					console.log(body)

					this.suiteModel.post(body)
					.then(doc => {
						res.tools.setJson(0, '生成套题成功', {_id: doc._id, title: doc.title, questions: doc.questions})
					})
					.catch(err => next(err))

				}

			}
		).catch(err => console.log(err))


	}


	scoreDemo(req, res, next) {
		const scoreBody = {
			user: mongoose.Types.ObjectId('626282b26a769711c6dfbb63'),//req.user.id,
			score: 10,
			scoreStat: 0,
			scoreType: 10,
			remark: "用户完成竞赛，奖励积分。"
		}

		this.userScoreModel.post(scoreBody)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '保存结果失败!请联系管理员。')
			return res.tools.setJson(0, '调用成功', doc)
		})
		.catch(err => console.log(err))
	}
}

export default Ctrl