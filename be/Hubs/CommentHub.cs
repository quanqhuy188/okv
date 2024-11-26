using Microsoft.AspNetCore.SignalR;

namespace OKVIP.Hubs
{
    public class CommentHub : Hub
    {

        public async Task SendComment(string productId, string userName, string comment)
        {

            await Clients.All.SendAsync("ReceiveComment", productId, userName, comment);
        }
    }
}
