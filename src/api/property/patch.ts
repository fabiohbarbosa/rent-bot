import { ObjectID } from 'mongodb';

import Log from '@config/logger';
import { logPrefix, path, statusAvailableToPatch } from './consts';
import HttpError from '../http-error';

const _parseBody = (body, _id) => {
  if (!body)
    throw new HttpError('Body cannot be null', 400);

  for (const [key] of Object.entries(body)) {
    if (key !== 'status' && key !== 'ps') {
      throw new HttpError('You can patch only fields \'status\' and/or \'ps\'', 400);
    }
  }

  const { status, ps } = body;
  if (status) {
    if (!statusAvailableToPatch.includes(status))
      throw new HttpError(`The 'status' should be: '${statusAvailableToPatch}'`, 400);
  }

  return { status, ps };
};

const _generateUpdate = (status, ps) => {
  const update = {
    status,
    ps,
    dirty: true
  };

  if (status === undefined) {
    delete update['status'];
    // property is dirty only when status is changed
    // this changes exists to prevent bot to change a property set to MATCHED or OUT_OF_FILTER by user to a reverse status
    update.dirty = false;
  }

  if (ps === undefined)
    delete update['ps'];

  return update;
};

const api = (router, db) => {
  router.patch(`${path}/:id`, async(req, res, next) => {
    try {
      const _id = new ObjectID(req.params.id);
      const { status, ps } = _parseBody(req.body, _id);
      const update = _generateUpdate(status, ps);

      Log.info(`${logPrefix} Patching property by id '${_id}'`);

      const updateResult = await db.collection('properties').updateOne({ _id }, { $set: update });
      if (updateResult.matchedCount === 0) {
        throw new HttpError(`Cannot find property '${_id}'`);
      }
      res.sendStatus(204);

    } catch (err) {
      next(err);
    }
  });
};

export default api;
