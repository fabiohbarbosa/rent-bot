import Log from '../../../config/logger';
import { logPrefix, path } from './consts';

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
    Log.info(`${logPrefix} Fetching the providers`);

    const providers = await db.collection('properties')
      .distinct('provider');

    if (providers.length === 0) {
      Log.warn(`${logPrefix} Not found providers`);
      res.send(204);
      return;
    }

    Log.info(`${logPrefix} Found ${providers.length} provider`);
    res.json(providers.sort());
  });
};

export default api;
