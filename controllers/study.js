import bluebird from 'bluebird'
import FS from 'fs'
import { options } from 'mongoose'
import proxy from '../proxy'
import formidable from 'formidable'
import config from '../config'


const fs = bluebird.promisifyAll(FS)

class Ctrl{
	constructor(app) {
		Object.assign(this, {
			app, 
			model: proxy.questions,
            upload: proxy.upload,
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
		this.app.post('/api/study/:id/record/:segIdx', this.updateRecord.bind(this))
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

		//res.tools.setJson(0, '上传成功', req)

		this.initFormidable(req, (err, fields, files) => {
			for (let item in files) {
				const file         = files[item] 
				const tempfilepath = file.path 
				const filenewname  = res.tools.randFilename(file) 
				const filenewpath  = 'public/uploads/voice/' +  filenewname
				const result       = 'uploads/' + filenewname

				// 将临时文件保存为正式的文件
				fs.renameAsync(tempfilepath, filenewpath)
				.then(doc => this.upload.newAndSave(file.name, result))
				.then(doc => {
                    //把数据拿去分析 给出结果?
                    //调用Python结构执行分析..
                    res.tools.setJson(0, '上传成功', doc)
                })
				.catch(err => next(err))
			}
		})
	}


}

export default Ctrl