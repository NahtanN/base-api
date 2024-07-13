export default class AppError extends Error {
  statusCode: number;
  data?: Record<string, any>;

  constructor(message: string, statusCode: number, data?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.data = data;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message: string = "Bad Request"): AppError {
    return new AppError(message, 400);
  }

  static unauthorized(message: string = "Unauthorized"): AppError {
    return new AppError(message, 401);
  }

  static paymentRequired(message: string = "Payment Required"): AppError {
    return new AppError(message, 402);
  }

  static forbidden(message: string = "Forbidden"): AppError {
    return new AppError(message, 403);
  }

  static notFound(message: string = "Not Found"): AppError {
    return new AppError(message, 404);
  }

  static methodNotAllowed(message: string = "Method Not Allowed"): AppError {
    return new AppError(message, 405);
  }

  static notAcceptable(message: string = "Not Acceptable"): AppError {
    return new AppError(message, 406);
  }

  static proxyAuthenticationRequired(
    message: string = "Proxy Authentication Required",
  ): AppError {
    return new AppError(message, 407);
  }

  static requestTimeout(message: string = "Request Timeout"): AppError {
    return new AppError(message, 408);
  }

  static conflict(message: string = "Conflict"): AppError {
    return new AppError(message, 409);
  }

  static gone(message: string = "Gone"): AppError {
    return new AppError(message, 410);
  }

  static lengthRequired(message: string = "Length Required"): AppError {
    return new AppError(message, 411);
  }

  static preconditionFailed(message: string = "Precondition Failed"): AppError {
    return new AppError(message, 412);
  }

  static payloadTooLarge(message: string = "Payload Too Large"): AppError {
    return new AppError(message, 413);
  }

  static uriTooLong(message: string = "URI Too Long"): AppError {
    return new AppError(message, 414);
  }

  static unsupportedMediaType(
    message: string = "Unsupported Media Type",
  ): AppError {
    return new AppError(message, 415);
  }

  static rangeNotSatisfiable(
    message: string = "Range Not Satisfiable",
  ): AppError {
    return new AppError(message, 416);
  }

  static expectationFailed(message: string = "Expectation Failed"): AppError {
    return new AppError(message, 417);
  }

  static teapot(message: string = "I'm a teapot"): AppError {
    return new AppError(message, 418);
  }

  static misdirectedRequest(message: string = "Misdirected Request"): AppError {
    return new AppError(message, 421);
  }

  static unprocessableEntity(
    message: string = "Unprocessable Entity",
  ): AppError {
    return new AppError(message, 422);
  }

  static locked(message: string = "Locked"): AppError {
    return new AppError(message, 423);
  }

  static failedDependency(message: string = "Failed Dependency"): AppError {
    return new AppError(message, 424);
  }

  static tooEarly(message: string = "Too Early"): AppError {
    return new AppError(message, 425);
  }

  static upgradeRequired(message: string = "Upgrade Required"): AppError {
    return new AppError(message, 426);
  }

  static preconditionRequired(
    message: string = "Precondition Required",
  ): AppError {
    return new AppError(message, 428);
  }

  static tooManyRequests(message: string = "Too Many Requests"): AppError {
    return new AppError(message, 429);
  }

  static requestHeaderFieldsTooLarge(
    message: string = "Request Header Fields Too Large",
  ): AppError {
    return new AppError(message, 431);
  }

  static unavailableForLegalReasons(
    message: string = "Unavailable For Legal Reasons",
  ): AppError {
    return new AppError(message, 451);
  }

  static internalServerError(
    message: string = "Internal Server Error",
  ): AppError {
    return new AppError(message, 500);
  }

  static notImplemented(message: string = "Not Implemented"): AppError {
    return new AppError(message, 501);
  }

  static badGateway(message: string = "Bad Gateway"): AppError {
    return new AppError(message, 502);
  }

  static serviceUnavailable(message: string = "Service Unavailable"): AppError {
    return new AppError(message, 503);
  }

  static gatewayTimeout(message: string = "Gateway Timeout"): AppError {
    return new AppError(message, 504);
  }

  static httpVersionNotSupported(
    message: string = "HTTP Version Not Supported",
  ): AppError {
    return new AppError(message, 505);
  }

  static variantAlsoNegotiates(
    message: string = "Variant Also Negotiates",
  ): AppError {
    return new AppError(message, 506);
  }

  static insufficientStorage(
    message: string = "Insufficient Storage",
  ): AppError {
    return new AppError(message, 507);
  }

  static loopDetected(message: string = "Loop Detected"): AppError {
    return new AppError(message, 508);
  }

  static notExtended(message: string = "Not Extended"): AppError {
    return new AppError(message, 510);
  }

  static networkAuthenticationRequired(
    message: string = "Network Authentication Required",
  ): AppError {
    return new AppError(message, 511);
  }

  static invalidSchema(
    message: string = "Invalid Schema",
    data: Record<string, any>,
  ): AppError {
    return new AppError(message, 400, data);
  }
}
