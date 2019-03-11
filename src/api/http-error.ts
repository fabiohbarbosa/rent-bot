class HttpError extends Error {
  constructor(message: string, public status = 500) {
    super(message);
    this.status = status;
  }
}

export default HttpError;
