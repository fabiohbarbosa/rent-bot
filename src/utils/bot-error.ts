class BotError extends Error {
  constructor(public message, public status, public fields = {}) {
    super(message);
  }
}

export default BotError;
