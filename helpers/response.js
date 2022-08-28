class Response {
  constructor(res) {
    this.res = res;
    this.BadRequest = 400;
    this.InternalServerError = 500;
    this.Forbidden = 403;
    this.Unauthorized = 401;
    this.NotFound = 404;
    this.Ok = 200;
    this.Created = 201;
  }

  Success(code, response) {
    this.res.status(code).json({
      code,
      data: response,
    });
  }

  Fail(code, status, errorMessage) {
    this.res.status(code).json({
      code,
      status: status,
      message: errorMessage,
    });
  }
}

module.exports = Response;
