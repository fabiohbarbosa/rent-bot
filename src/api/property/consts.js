const logPrefix = '[api:property]:';
const path = '/property';
const projection = {
  providerId: 1, createAt: 1, price: 1,
  provider: 1, status: 1, title: 1, type: 1,
  url: 1, topology: 1
};
const propertyStatus = [ 'UNVAILABLE', 'OUT_OF_FILTER', 'MATCHED', 'PENDING' ];

export { logPrefix, path, projection, propertyStatus };
