import bluebird from 'bluebird'
import FS from 'fs'
import { options } from 'mongoose'
import proxy from '../proxy'
import formidable from 'formidable'
import config from '../config'
import mongoose from 'mongoose'
import axios from 'axios'
import FormData from 'form-data'
const ObjectId = mongoose.Schema.Types.ObjectId

const fs = bluebird.promisifyAll(FS)

class Ctrl{
	constructor(app) {
		Object.assign(this, {
			app, 
			model: proxy.study,
            upload: proxy.upload,
            voiceModel: proxy.voice,
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
		this.app.get('/api/study/:id', this.get.bind(this))
		this.app.post('/api/study/:id/record/:segIdx', this.updateRecord.bind(this))
		this.app.post('/api/study/demo', this.post.bind(this))
		this.app.put('/api/study/demo', this.put.bind(this))
	}

    /**
	 * 创建表单上传           
	 */
	initFormidable(req, callback) {
		// 创建表单上传
	    const form = new formidable.IncomingForm()
		
	    // 设置编辑
	    form.encoding = 'utf-8'

	    // 设置文件存储路径
	    form.uploadDir = config.upload.tmp

	    // 保留后缀
	    form.keepExtensions = true

	    // 设置单文件大小限制    
	    form.maxFieldsSize = 2 * 1024 * 1024

	    // 设置所有文件的大小总和
	    form.maxFields = 1000

	    form.parse(req, (err, fields, files) => callback(err, fields, files))
	}

	updateRecord(req, res, next) {

        console.log("id", req.params.id)
        console.log("segIdx", req.params.segIdx)

		if(!req.params.id || !req.params.segIdx) {
			res.tools.setJson(1, '填入参数错误')
		}

		const voiceId = req.params.id
		const voiceSegId = req.params.segIdx

		const idLists = [
			'6266a1cae81e8e1e538bd4f6',
			'6266a1e5e81e8e1e538bd4f7',
			'6266a0cce81e8e1e538bd4f5'
		]

		idLists.forEach((item, index, array) => {

		})

		//res.tools.setJson(0, '上传成功', req)

		this.initFormidable(req, (err, fields, files) => {
			for (let item in files) {
				const file         = files[item] 
				const tempfilepath = file.path 
				const filenewname  = res.tools.randFilename(file) 
				const filenewpath  = 'public/uploads/voice/' +  filenewname
				const result       = 'uploads/' + filenewname

				let randNum = function (min, max) {
					return Math.floor(Math.random() * (max - min)) + min   
				  }

				// 将临时文件保存为正式的文件
				fs.renameAsync(tempfilepath, filenewpath)
				.then(doc => this.upload.newAndSave(file.name, result))
				.then(doc2 => {
                    //把数据拿去分析 给出结果?
                    
					//调用Python结构执行分析..
					var forms = new FormData();

					forms.append('id', voiceId)
					forms.append('segId', voiceSegId)
					forms.append('file', fs.createReadStream(filenewpath))

					var config = {
						method: 'post',
						url: 'http://8.134.216.143:5000/upload',
						headers: forms.getHeaders(),
						data : forms
					};

					return axios(config)
					// .then(function (response) {
					// 	console.log("responseData", JSON.stringify(response.data));
					// })
					// .catch(function (error) {
					// 	console.log(error);
					// });

					//console.log(res)

					const resData = {
						grade: randNum(60, 100),
						commentId: randNum(0, 10),
						doc: doc2
					}
                    
					//数据入库
					
					const voiceBody = {
						userId: mongoose.Types.ObjectId(req.user._id),
						grade: resData['grade'],
						commentId: resData['commentId'],
						studyId: mongoose.Types.ObjectId('626282b26a769711c6dfbb63'),//voiceId
						segId: voiceSegId,
						voicePath: filenewpath,

						//parentId: mongoose.Types.ObjectId(refInfo.userId),
						//refSrc: refInfo.path,
						//refTime: refInfo.firstTime
					}

					console.log(voiceBody)
					
					//this.voiceModel.


					//给出评分
					res.tools.setJson(0, '上传成功', resData)
                })
				.then(response => {
					console.log("responseData", JSON.stringify(response.data))
					let data = response.data

					//还需要判断是否有值?
					if(data['status'] != 0) {
						return res.tools.setJson(1, '在与评测服务器交互时发生错误', data)
					}

					const resData = {
						score: data['score'],
						commentId: data['commentId'],
					}
					//数据入库

					const voiceBody = {
						userId: mongoose.Types.ObjectId(req.user._id),
						grade: resData['score'],
						commentId: resData['commentId'],
						studyId: mongoose.Types.ObjectId(idLists[voiceId - 1]),//voiceId
						segId: int(voiceSegId),
						voicePath: filenewpath,

						//parentId: mongoose.Types.ObjectId(refInfo.userId),
						//refSrc: refInfo.path,
						//refTime: refInfo.firstTime
					}

					console.log(voiceBody)

					res.tools.setJson(0, '评测成功', resData)
					
				})
				.catch(err => next(err))
			}
		})
	}

	get(req, res, next) {
		console.log("params", req.params.sid, req.params.id)
		const idLists = [
			'6266a1cae81e8e1e538bd4f6',
			'6266a1e5e81e8e1e538bd4f7',
			'6266a0cce81e8e1e538bd4f5'
		]
		const _sid = req.params.id

		const _id = idLists[_sid - 1]

		const params = {
			query  : {
				_id: _id
			},
			fields : {}, 
			options: {}, 
		}

		console.log(_id, params)

		this.model.model.findOne(params.query, params.fields).exec()
		.then(result => {
			if (!result) return res.tools.setJson(1, 'study不存在或已删除')
			return res.tools.setJson(0, '调用成功', result)
		}).catch(err => next(err))

	}


	post(req, res, next) {
		// segments需要判断是不是json类型?
		let segments = []
		
		try{
			segments = JSON.parse(req.body.segments)
		}catch(e) {
			console.log(e)
		}

		const body = {
			title    : req.body.title,
			content  : req.body.content,
			videoUrl : req.body.videoUrl,
			segments : segments,
			status   : req.body.status
		}

		console.log(body)

		this.model.post(body)
		.then(doc => res.tools.setJson(0, '新增成功', {_id: doc._id}))
		.catch(err => next(err))
	}

	put(req, res, next) {
		const query = {
			_id: req.body.id
		}

		const body = {
			comments: JSON.parse(req.body.comments),
		}

		console.log(req.body.comments)
		console.log(JSON.parse(req.body.comments))

		this.model.put(query, body)
		.then(doc => {
			if (!doc) return res.tools.setJson(1, '资源不存在或已删除')
			return res.tools.setJson(0, '更新成功', doc)
		})
		.catch(err => next(err))
	}

	import(req, res, next) {
		//
	}


}

export default Ctrl