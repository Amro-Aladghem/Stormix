using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.VideoSegmentDtos
{
    public record VideoSegmentDto
    {
        public Guid SegmentId { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string Summary { get; set; }
        public string PrimaryTopic { get; set; }
        public string[] Questions { get; set; }
        public string[] Tags { get; set; }
        public int LanguageId { get; set; }
    }
}
