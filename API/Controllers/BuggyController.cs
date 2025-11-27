using System.Security.Claims;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("unauthorized")]
    public IActionResult GetAnAuthorized()
    {
        return Unauthorized();
    }
    
    [HttpGet("badrequest")]
    public IActionResult GetBadRequest()
    {
        return BadRequest();
    }
    
    [HttpGet("notfound")]
    public IActionResult GetNotFound()
    {
        return NotFound();
    }
    
    [HttpGet("internalerror")]
    public IActionResult GetInternalError()
    {
        throw new Exception("This is a test exception");
    }
    
    [HttpPost("validationerror")]
    public IActionResult GetValidationError(CreateProductDto  product)
    {
        return Ok();
    }
    
    [Authorize]
    [HttpGet("secret")]
    public IActionResult GetSecret()
    {
        var name = User.FindFirst(ClaimTypes.Name)?.Value;
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        return Ok("Hello " + name +  " with the id of : " + id);
    }
    
     
    [Authorize(Roles = "Admin")]
    [HttpGet("admin-secret")]
    public IActionResult GetAdminSecret()
    {
        var name = User.FindFirst(ClaimTypes.Name)?.Value;
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var isAdmin = User.IsInRole("Admin");
        var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

        return Ok(new
        {
            name,
            id,
            isAdmin,
            roles
        });
    }
}