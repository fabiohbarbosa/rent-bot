/**
 * @typedef {import('mongodb').Db} MongoDb
 */

/**
 *
 * @param {MongoDb} db
 * @param {object} query - query mongo json object
 * @param {object} sort - sort mongo json object
 */
const batchProperties = (db, query, sort, size, projection = {}) => {
  return db.collection('properties')
    .find(query, projection)
    .sort(sort)
    .limit(size)
    .toArray();
};

/**
 *
 * @param {MongoDb} db
 * @param {function} callback
 * @param {*} vars
 */
const updateDateBatch = (db, filter, set, callback) => {
  db.collection('properties')
    .updateOne(filter, { $set: set }, callback);
};

export { batchProperties, updateDateBatch };
