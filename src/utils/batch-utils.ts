import { Db } from 'mongodb';

const executeQuery = (db: Db, query, sort = {}, projection = {}) => {
  return db.collection('properties')
    .find(query, projection)
    .sort(sort)
    .toArray();
};

const batchProperties = (db: Db, query, sort, size: number, projection = {}) => {
  return db.collection('properties')
    .find(query, projection)
    .sort(sort)
    .limit(size)
    .toArray();
};

const updateProperties = (db: Db, filter, set, callback) => {
  db.collection('properties')
    .updateMany(filter, { $set: set }, callback);
};

export { batchProperties, updateProperties, executeQuery };
