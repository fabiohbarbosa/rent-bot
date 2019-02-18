const batchProperties = (db, query, sort, size, projection = {}) => {
  return db.collection('properties')
    .find(query, projection)
    .sort(sort)
    .limit(size)
    .toArray();
};

const updateDateBatch = (db, filter, set, callback) => {
  db.collection('properties')
    .updateOne(filter, { $set: set }, callback);
};

export { batchProperties, updateDateBatch };
