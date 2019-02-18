class HttpError extends Error {
  constructor(message, public status = 500) {
    super(message);
    this.status = status;
  }
}

export default HttpError;
