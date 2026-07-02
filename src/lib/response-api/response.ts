export interface ApiResponse<T> {
  content: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface ApiErrorResponse<T>{
  success: false;
  message: string;
  code?: string; // Mã lỗi nội bộ để Frontend dễ xử lý logic
  errors?:T;   // Dùng cho trường hợp validate form (Zod errors)
}

export function toApiRestponse<T, R>(
  rows: T[],
  total: number,
  page: number,
  pageSize: number,
  mapper: (item: T) => R
): ApiResponse<R> {
  return {
    content: rows.map(mapper),
    pagination: {
      page,
      pageSize,
      total,
    },
  };
}

import { NextResponse } from "next/server";

export function toErrorResponse(
  message: unknown,
  status: number = 500,
  code?: string
) {
  const errorMessage = message instanceof Error ? message.message : String(message);

  return NextResponse.json(
    {
      success: false,
      message: errorMessage,
      code: code || `ERROR_${status}`,
    },
    { status }
  );
}