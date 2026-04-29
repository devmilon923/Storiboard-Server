import { Response } from "express";
export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  pagination?: {
    totalPage?: number;
    currentPage?: number;
    prevPage?: number;
    nextPage: number;
    limit?: number;
    totalItem?: number;
  };
  cursor?: any;
  data: T;
};
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    status: data.statusCode,
    message: data?.message,
    pagination: data.pagination,
    data: data.data,
    cursor: data.cursor,
  });
};

export default sendResponse;
