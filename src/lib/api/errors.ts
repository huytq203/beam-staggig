"server-only";

export class HttpError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
    this.name = "HttpError";
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Không tìm thấy") {
    super(404, message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Dữ liệu không hợp lệ") {
    super(400, message, "BAD_REQUEST");
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Chưa đăng nhập") {
    super(401, message, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Không có quyền truy cập") {
    super(403, message, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message = "Quá nhiều yêu cầu, vui lòng thử lại sau") {
    super(429, message, "TOO_MANY_REQUESTS");
    this.name = "TooManyRequestsError";
  }
}

export function toErrorResponse(error: unknown) {
  const isProd = process.env.NODE_ENV === "production";

  if (error instanceof HttpError) {
    return {
      status: error.status,
      body: { success: false, code: error.code, message: error.message },
    };
  }

  const message = error instanceof Error ? error.message : String(error);
  return {
    status: 500,
    body: {
      success: false,
      code: "INTERNAL_ERROR",
      message: isProd ? "Lỗi máy chủ" : message,
    },
  };
}
