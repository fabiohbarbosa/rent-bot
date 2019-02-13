import Log from '../../../config/logger';
import { logPrefix, path, topologies } from './consts';

/**
 * @typedef {import('express').Router} Router
 * @typedef {import('mongodb').Db} MongoDb
 */

/**
 * @param {Router} router - express route
 * @param {MongoDb} db - mongo connection
 */
const api = (router, db) => {
  router.get(path, async(req, res, next) => {
    Log.info(`${logPrefix} Fetching the topologies`);

    Log.info(`${logPrefix} Found ${topologies.length} topologies`);
    res.json(topologies.sort());
  });
};

export default api;
