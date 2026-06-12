using Infrastructure.ExternalServices;
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

builder.Services.AddSingleton<GoogleAI>(sp => new GoogleAI(apiKey: builder.Configuration.GetSection("geminiApi").Value!));
builder.Services.AddSingleton<GenerationConfig>(gc => new GenerationConfig() { ResponseMimeType = "application/json", Temperature = 0 });
builder.Services.AddScoped<AiEmbeddingService>();
builder.Services.AddScoped<QdrantSegmentSearchService>();
builder.Services.AddScoped<SearchResultService>();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
