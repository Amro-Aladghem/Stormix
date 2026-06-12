using Application.DTOs.VideoSegmentDtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.ExtracedVideoDtos
{
    public record FullExtracedVideoDto
    {
        public Guid VideoId { get; set; }

        public List<VideoSegmentDto> Segments { get; set; }
        public string Url { get; set; }
    }
}
