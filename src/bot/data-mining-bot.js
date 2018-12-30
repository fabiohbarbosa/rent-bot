import Log from '../../config/logger';

class DataMiningBot {
  /**
   *
   * @param {MongoDb} db - mongo connection
   * @param {*} Minder - data miner of provider data
   */
  static mine(db, Miner) {
    Log.info(`Initialising data mining for ${Miner.name}...`);
  }
}

export default DataMiningBot;
