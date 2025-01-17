using API.Extensions;
using API.Middleware;
using API.SignalR;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers(opt=>{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});
var tokenKey = builder.Configuration["TokenKey"] ?? Environment.GetEnvironmentVariable("TokenKey");
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

// Add services to the container.

var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();

app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.NoReferrer());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt=>opt.Deny());
app.UseCsp(opt => opt
    .BlockAllMixedContent()
    .StyleSources(s=>s.Self().CustomSources("https://fonts.googleapis.com"))
    .FontSources(s=>s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
    .FormActions(s=>s.Self())
    .FrameAncestors(s=>s.Self())
    .ImageSources(s=>s.Self().CustomSources("blob:","https://res.cloudinary.com"))
    .ScriptSources(s=>s.Self())
);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else{
    app.Use(async (context, next)=>
    {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
        await next.Invoke();
    });
}


app.UseCors("CorsPolicy");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();


app.MapControllers();
app.MapHub<ChatHub>("/chat");
app.MapFallbackToController("Index","Fallback");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context,userManager);
}
catch(Exception ex){
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex,"An error occured during migration");
    Console.WriteLine($"Migration Error: {ex.Message}");
    Console.WriteLine($"Stack Trace: {ex.StackTrace}");
}

app.Run();
