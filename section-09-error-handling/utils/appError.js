module.exports = class AppError extends Error {
  constructor(message, statusCode) {
    // call `message` from super class
    super(message);

    this.statusCode = statusCode;

    // defind status ถ้า code เป็น 4 status: 'fail', อื่นๆ server error
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // กำหนดว่าถ้าเรียกใช้ AppError class หมายถึง
    // error ที่เกิดจาก operation error ไม่ใช่ programming error
    this.isOperatioal = true;

    //
    Error.captureStackTrace(this, this.constructor);
  }
};
