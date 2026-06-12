using Application.DTOs.ExtracedVideoDtos;
using Application.DTOs.VideoSegmentDtos;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class VideoExtractedService
    {
        private readonly IManagerRepository _managerRepository;

        public VideoExtractedService(IManagerRepository managerRepository)
        {
            _managerRepository = managerRepository;
        }

        public async Task<FullExtracedVideoDto?> GetFullExtractedVideoInfo(Guid VideoId)
        {
            ExtractedVideo? extractedVideo = await _managerRepository.ExtractedVideoRepository.GetFullExtractedVideoInfoById(VideoId);

            if (extractedVideo is null)
                return null;

            FullExtracedVideoDto fullExtracedVideoDto = new FullExtracedVideoDto()
            {
                VideoId = extractedVideo.Id,
                Url = extractedVideo.VideoUrl,
                Segments = extractedVideo.VideoSegments.Select(s => new VideoSegmentDto()
                {
                    SegmentId = s.Id,
                    Start = s.StartInSeconds,
                    End = s.EndInSeconds,
                    LanguageId = s.LanguageId,
                    PrimaryTopic = s.PrimaryTopic,
                    Summary = s.Summary,
                    Tags = s.Tags.Select(t => t.Name).ToArray(),
                    Questions = s.SegmentQuestions.Select(q => q.Text).ToArray()
                }).ToList()
            };

            return fullExtracedVideoDto;
        }
    }
}
