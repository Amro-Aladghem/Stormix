using Application.DTOs.QdrantSearchDtos;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.ExternalServices
{
    public class SearchResultService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly AiEmbeddingService _aiEmbeddingService;
        private readonly QdrantSegmentSearchService _qdrantSegmentSearchService;

        private static readonly float TagMatchScore = 0.05f;
        private static readonly float PrimaryTopicMatchScore = 0.1f;
        public SearchResultService(IHttpClientFactory httpClientFactory, IConfiguration configuration, AiEmbeddingService aiEmbeddingService)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _aiEmbeddingService = aiEmbeddingService;
            _qdrantSegmentSearchService = new QdrantSegmentSearchService(httpClientFactory, configuration,aiEmbeddingService); 
        }

        private async Task<List<SegmentSearchResultDto>> GetSearchResults(string text,string [] tags)
        {
            List<SegmentSearchResultDto> results = await _qdrantSegmentSearchService.HandleGetSearchTasksResults(text,tags);
            return results;
        }

        private void UpdateResultsSocreMatchBasedOnTags(HashSet<string>UserInputTags, List<SegmentSearchResultDto> Results)
        {
            Results.ForEach(result =>
            {
                foreach (var tag in result.Payload.Tags)
                {
                    if (UserInputTags.Contains(tag))
                        result.Score = result.Score + TagMatchScore;
                }
            });
        }

        private void UpdateResultsPrimaryTopicMatch(HashSet<string>UserInputTags, List<SegmentSearchResultDto> Results)
        {
            Results.ForEach(result =>
            {
                foreach (var primaryTopicTag in result.Payload.PrimaryTopic.Split(" "))
                {
                    if(UserInputTags.Contains(primaryTopicTag))
                        result.Score = result.Score + PrimaryTopicMatchScore;
                }
            });
        }

        public async Task<List<SegmentSearchResultDto>> HandleGetSearchResultsWithFinalScores(SearchRequestDto searchRequestDto)
        {
            List<SegmentSearchResultDto> SearchedResults = await GetSearchResults(searchRequestDto.text, searchRequestDto.tags);

            if (SearchedResults.Count <= 0)
                throw new Exception("Failed to get results");

            HashSet<string> UserTagsSet = searchRequestDto.tags.ToHashSet<string>(StringComparer.OrdinalIgnoreCase);

            UpdateResultsSocreMatchBasedOnTags(UserTagsSet, SearchedResults);

            UpdateResultsPrimaryTopicMatch(UserTagsSet, SearchedResults);

            return SearchedResults; 
        }


    }
}
