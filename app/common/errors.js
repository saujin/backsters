
class ErrorBase extends Error {
  constructor(message, type, status) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.type = type
    this.status = status
  }
}

export class InternalServerError extends ErrorBase {
  constructor(message = 'Something went wrong.') {
    super(message, 'E_INTERNAL', 500)
  }
}

export class InvalidParametersError extends ErrorBase {
  constructor(message = 'Invalid parameters') {
    super(message, 'E_INVALID_PARAMS', 400)
  }
}

export class ValidationError extends ErrorBase {
  constructor(message = 'Validation did not passed', errors = []) {
    super(message, 'E_VALIDATION', 400)
    this.errors = errors
  }
}

export class DatabaseError extends ErrorBase {
  constructor(message = 'Problem with operation on the database.') {
    super(message, 'E_DATABASE', 400)
  }
}

export class UnauthorizedError extends ErrorBase {
  constructor(message = 'The user was not authorized.') {
    super(message, 'E_UNAUTHORIZED', 401)
  }
}

export class InvalidEmailPassword extends ErrorBase {
  constructor(message = 'Unknown user and password combination.') {
    super(message, 'E_INVALID_EMAIL_PASSWORD', 200)
  }
}
