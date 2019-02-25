import { Db } from "mongodb";

const batchProperties = (db: Db, query, sort, size, projection = {}) => {
  return db.collection('properties')
    .find(query, projection)
    .sort(sort)
    .limit(size)
    .toArray();
};

const updateDateBatch = (db: Db, filter, set, callback) => {
  db.collection('properties')
    .updateMany(filter, { $set: set }, callback);
};

export { batchProperties, updateDateBatch };
