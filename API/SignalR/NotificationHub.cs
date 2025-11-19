using System.Collections.Concurrent;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

// we are doing this to notify the user based on his email address
// once we connect we relate the use's email to the connectionId and vice versa
[Authorize]
public class NotificationHub: Hub
{
    // TODO : user redis to save the user's email address
    private static readonly ConcurrentDictionary<string, string> UserConnections = new();

    public override Task OnConnectedAsync()
    {
        var email = Context.User?.GetEmail();
        if (!string.IsNullOrEmpty(email))
        {
            UserConnections[email] = Context.ConnectionId; // adding email to the dictionary
        }
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var email = Context.User?.GetEmail();
        if (!string.IsNullOrEmpty(email))
        {
            UserConnections.TryRemove(email, out _); // remove email from the dictionary
        }
        return base.OnDisconnectedAsync(exception);
    }

    public static string? GetConnectionIdByEmail(string email)
    {
        UserConnections.TryGetValue(email, out var connectionId);
        return connectionId;
    }
}