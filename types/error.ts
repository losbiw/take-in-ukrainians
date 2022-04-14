class ErrorWithCode extends Error {
  public statusCode;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.name = ErrorWithCode.name;
  }
}

export default ErrorWithCode;
