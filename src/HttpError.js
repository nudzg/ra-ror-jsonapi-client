class HttpError extends Error {

  constructor(jsonError, statusText, status) {
    let summary = statusText;

    if (jsonError && jsonError.errors !== 'undefined') {
      summary = jsonError.errors
        .filter(e => e.detail)
        .map(e => e.detail).join(', ');
    }

    super(summary);
    this.message = summary;
    this.status = status;
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
    this.stack = new Error().stack;
  }
}

export default HttpError;
