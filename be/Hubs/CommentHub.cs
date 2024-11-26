using Microsoft.AspNetCore.SignalR;

namespace OKVIP.Hubs
{
    public class CommentHub : Hub
    {
        // Hàm này sẽ được gọi khi client gửi comment
        public async Task SendComment(string productId, string userName, string comment)
        {
            // Gửi comment tới tất cả các client đang kết nối
            await Clients.All.SendAsync("ReceiveComment", productId, userName, comment);
        }
    }
}
