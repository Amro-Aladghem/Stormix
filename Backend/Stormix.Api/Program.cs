using Application.Services;
using Domain.Interfaces;
using Infrastructure.Data;
using Infrastructure.ExternalServices;
using Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Mscc.GenerativeAI;
using Mscc.GenerativeAI.Types;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddHttpClient("QdrantClient", (serviceProvider, client) =>
{
    var configuration = serviceProvider.GetRequiredService<IConfiguration>();
    client.DefaultRequestHeaders.Add("api-key", configuration["Qdrant:ApiKey"]);
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration["SQL_CONNECTION_STRING"]);
});

builder.Services.AddSingleton<GoogleAI>(sp => new GoogleAI(apiKey: builder.Configuration.GetSection("geminiApi").Value!));
builder.Services.AddSingleton<GenerationConfig>(gc => new GenerationConfig() { ResponseMimeType = "application/json", Temperature = 0 });
builder.Services.AddScoped<AiEmbeddingService>();
builder.Services.AddScoped<QdrantSegmentSearchService>();
builder.Services.AddScoped<SearchResultService>();
builder.Services.AddScoped<IManagerRepository, ManagerRepository>();
builder.Services.AddScoped<AddRequestVideoService>();
builder.Services.AddScoped<VideoExtractedService>();

builder.Services.AddControllers()
    .AddApplicationPart(typeof(Presentation.AssemblyRefference).Assembly);


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
