using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class ExtractedVideo
    {
        public Guid Id { get; set; }
        public string VideoUrl { get; set; }

        public List<VideoSegment> VideoSegments { get; set; }
    }
}
