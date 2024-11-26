using System.ComponentModel;

namespace OKVIP.Libraries
{
    public class ReturnCode
    {
        /// <summary>
        /// Mã lỗi
        /// </summary>
        public ErrorCode Code { get; set; }

        /// <summary>
        /// Mô tả lỗi
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Kiểm tra nếu không có lỗi
        /// </summary>
        public bool IsOk => Code == ErrorCode.None;

        /// <summary>
        /// Trả về mã HTTP status code từ ErrorCode
        /// </summary>
        public int StatusCode => Code.GetHttpStatusCode();
    }

    /// <summary>
    /// Lớp mở rộng của ReturnCode để trả về dữ liệu cùng mã lỗi
    /// </summary>
    public class ObjectReturnCode<T> : ReturnCode
    {
        /// <summary>
        /// Dữ liệu trả về
        /// </summary>
        public T Data { get; set; }
    }
    public static class ErrorCodeExtensions
    {
        /// <summary>
        /// Phương thức mở rộng để lấy mã HTTP status code từ ErrorCode
        /// </summary>
        public static int GetHttpStatusCode(this ErrorCode errorCode)
        {
            return (int)errorCode;
        }
    }

    public enum ErrorCode
    {
        [Description("Đã xảy ra lỗi")]
        HasError = 500, // Internal Server Error

        [Description("Không có lỗi")]
        None = 200, // OK

        [Description("Token đã hết hạn")]
        System_TokenExpired = 401, // Unauthorized

        [Description("Token không hợp lệ")]
        System_TokenInvalid = 401, // Unauthorized

        [Description("Token rỗng")]
        System_TokenEmpty = 401, // Unauthorized

        [Description("Đối tượng đã tồn tại")]
        Common_Existed = 400, // Bad Request

        [Description("Không tìm thấy đối tượng")]
        Common_NotFound = 404, // Not Found

        [Description("Đối tượng đang được sử dụng")]
        Common_InUse = 409, // Conflict

        [Description("Đối tượng không hợp lệ")]
        Common_Invalid = 400 // Bad Request
    }
}
