import { MongoClient } from 'mongodb';
import assert from 'assert';

import Log from './logger';

class Db {
  static async createConnection(url: string, dbName: string) {
    try {
      const client = await MongoClient.connect(url, { useNewUrlParser: true });
      assert.equal(true, client.isConnected());

      Log.info(`MongoDB connection is ready for database ${dbName}`);

      return client.db(dbName);
    } catch (err) {
      Log.error('Error to establish MongoDB connection');
      Log.error(err);
      process.exit(1);
    }
  }
}

export default Db;
