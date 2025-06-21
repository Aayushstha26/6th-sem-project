class Apierror extends Error {
  constructor(statuscode, message = "error", errors = [], stack) {
    super(message);
    this.statuscode = statuscode;
    this.errors = errors;
    this.data = null;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export {Apierror}