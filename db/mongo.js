import bluebird from 'bluebird'
import mongoose from 'mongoose'
import mongoomise from 'mongoomise'

class Mongo{
	constructor(app, config) {
		Object.assign(this, {
			app, 
			config, 
		})

		this.init()
	}

	init() {
		this.env    = this.app.get('env')
		this.dblink = this.config['mongo'][this.env]['connectionString']

		const opts = {
			useMongoClient: true,
			server: {
				socketOptions: { 
					keepAlive: 1 
				}
			}
		}

		mongoose
			.connect(this.dblink, opts)
		
		mongoose
			.connection
			.on('error', err => console.log('------ Mongodb connection failed ------' + err))
			.on('open', () => console.log('------ Mongodb connection succeed ------'))

		mongoose.Promise = global.Promise
			
		mongoomise.promisifyAll(mongoose, bluebird)
	}
}

export default Mongo