import mongodb from 'mongodb';
import config from 'config';

const dbConfig = config.get('database');

const client = await mongodb.MongoClient(
	dbConfig.connectionString, { 
		useUnifiedTopology: true
	}
).connect();

export const database = client.db(dbConfig.name);
