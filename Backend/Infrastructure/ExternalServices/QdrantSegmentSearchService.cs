using Application.DTOs.QdrantSearchDtos;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
namespace Infrastructure.ExternalServices
{
    public class QdrantSegmentSearchService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly AiEmbeddingService _aiEmbeddingService;

        public QdrantSegmentSearchService(IHttpClientFactory httpClientFactory,IConfiguration configuration, AiEmbeddingService aiEmbeddingService)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _aiEmbeddingService = aiEmbeddingService;
        }


        public async Task<List<SegmentSearchResultDto>> SearchInQdrantAsync(float[] vector, object? filter=null)
        {
            var client = _httpClientFactory.CreateClient("QdrantClient");

            var url = $"{_configuration["Qdrant:Url"]}/collections/{_configuration["Qdrant:Name"]}/points/search";

            var requestBody = new
            {
                vector = vector,
                limit = 5,
                //filter = filter,
                with_payload = true
            };

            var response = await client.PostAsJsonAsync(url, requestBody);

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Qdrant Error: {await response.Content.ReadAsStringAsync()}");

            var qdrantData = await response.Content.ReadFromJsonAsync<QdrantResponse>();

            return qdrantData?.Result.Select(hit => new SegmentSearchResultDto
            {
                Id = hit.Id,
                Score = hit.Score,
                Payload = new SearchedSegmentDto
                {
                    SegmentId = hit.Id,

                    VideoId = GetString(hit.Payload, "videoId"),
                    Summary = GetString(hit.Payload, "summary"),
                    PrimaryTopic = GetString(hit.Payload, "primaryTopic"),
                    Language = GetString(hit.Payload, "language"),
                    Url = GetString(hit.Payload, "url"),

                    Start = hit.Payload.TryGetValue("start", out var startEl) ? startEl.GetInt32() : 0,
                    End = hit.Payload.TryGetValue("end", out var endEl) ? endEl.GetInt32() : 0,

                    Questions = hit.Payload.TryGetValue("questions", out var questionsEl) && questionsEl.ValueKind == JsonValueKind.Array
                                ? questionsEl.EnumerateArray().Select(x => x.GetString() ?? "").ToArray()
                                : Array.Empty<string>(),

                    Tags = hit.Payload.TryGetValue("tags", out var tagsEl) && tagsEl.ValueKind == JsonValueKind.Array
                           ? tagsEl.EnumerateArray().Select(x => x.GetString() ?? "").ToArray()
                           : Array.Empty<string>()
                }
            }).ToList() ?? new List<SegmentSearchResultDto>();
        }

        private object? BuildFilter(string[] tagsFilter)
        {
            if (tagsFilter == null || tagsFilter.Length == 0) return null;

            var mustConditions = new List<object>();

            mustConditions.Add(new
            {
                key = "tags",
                match = new
                {
                    any = tagsFilter 
                }
            });

            return new
            {
                must = mustConditions
            };
        }

        private string? GetString(Dictionary<string, JsonElement> payload, string key) =>
            payload.TryGetValue(key, out var el) ? el.GetString() : null;

        public async Task<List<SegmentSearchResultDto>> HandleGetSearchTasksResults(string text, string[]tagsFilter)
        {
            var embeddingList = await _aiEmbeddingService.GetEmbeddingTextResult(text);
            var embedding = embeddingList.ToArray();

           //  var filter = BuildFilter(tagsFilter);

            return await SearchInQdrantAsync(embedding);
        }

    }
}
