import Log from '../../config/logger';

export default (err, req, res, next) => {
  const message = err.message || 'Internal server error';
  const status = err.status || 500;

  res.status(status).json({ message });
  Log.error(err.stack);
}
