import { ObjectID } from 'mongodb';

import Log from '../../../config/logger';
import { logPrefix, path, propertyStatus } from './consts';
import HttpError from '../http-error';

/**
 * @typedef {import('express').Router} Router
 * @typedef {import('mongodb').Db} MongoDb
 */

const _getStatusFromBody = (body, _id) => {
  if (!body) {
    throw new HttpError('Field \'status\' cannot be null', 400);
  }

  for (const [key, value] of Object.entries(body)) {
    if (key !== 'status')  {
      throw new HttpError('You can patch only field \'status\'', 400);
    }
  }


  const { status } = body;
  if (!status) {
    throw new HttpError('Field \'status\' cannot be null', 400);
  }

  if (!propertyStatus.includes(status)) {
    throw new HttpError(`The 'status' should be: '${propertyStatus}'`, 400);
  }
  return status;
}

/**
 * @param {Router} router - express route
 * @param {MongoDb} db - mongo connection
 */
const api = (router, db) => {
  router.patch(`${path}/:id`, async (req, res, next) => {
    try {
      const _id = new ObjectID(req.params.id);
      const status = _getStatusFromBody(req.body, _id);

      Log.info(`${logPrefix} Patching property by id '${_id}'`);

      const updateResult = await db.collection('properties').updateOne( { _id }, { $set: { status } });
      if (updateResult.modifiedCount === 0) {
        throw new HttpError(`Cannot find property '${_id}'`);
      }
      res.send(204);

    } catch(err) {
      next(err);
    }
  });
}

export default api;
