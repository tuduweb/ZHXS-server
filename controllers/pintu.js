import proxy from '../proxy'
import mongoose from 'mongoose'
import user_score from '../models/user_score'

class Ctrl{
	constructor(app) {
		Object.assign(this, {
			app, 
			model: proxy.pintu,
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
		this.app.get('/api/pintu/demo', this.getAll.bind(this))
		this.app.post('/api/pintu/demo', this.postNew.bind(this))
		this.app.get('/api/pintu/demo/:id', this.get.bind(this))
	}

	getAll(req, res, next) {

		const query = {
            "status": 1
        }

		const fields = {}

		const options = {
			// page : req.query.page, 
			// limit: req.query.limit, 
		}

		this.model.getAll(query, fields, options)
		.then(doc => {

            // doc.forEach((item, index, arr) => {
            //     console.log(item)
            // })

			res.tools.setJson(0, '调用成功', doc)
		})
		.catch(err => next(err))

    }

    get(req, res, next) {
		const params = {
			query  : {
				_id: req.params.id
			},
			fields : {}, 
			options: {}, 
		}

		this.model.model.findOne(params.query, params.fields).exec()
		.then(result => {
			if (!result) return res.tools.setJson(1, '记录不存在或已删除')
			return res.tools.setJson(0, '调用成功', result)
		}).catch(err => next(err))
    }

    postNew(req, res, next) {

        const body = {
			shortname: req.body.shortname,
			title : req.body.shortname,
			content: req.body.content,
			type : req.body.type, 
            imageUrl: req.body.imageUrl,
            thumbUrl: req.body.thumbUrl,
            status: 1
        }
		
        console.log(body)

		this.model.post(body)
		.then(doc => res.tools.setJson(0, '新增成功', {_id: doc._id}))
		.catch(err => next(err))
    }
}

export default Ctrl