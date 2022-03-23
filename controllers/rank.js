import { options } from 'mongoose'
import proxy from '../proxy'

class Ctrl{
	constructor(app) {
		Object.assign(this, {
			app, 
			model: proxy.questions, 
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
		this.app.get('/api/rank', this.getAll.bind(this))
	}

	getRank(req, res, next) {
        const rankData = {
            ranks: [
                {
                    userName: "123"
                },
            ]
        }
        res.tools.setJson(0, '调用成功', rankData)
    }
}

export default Ctrl