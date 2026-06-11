using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class VideoSegment
    {
        public Guid Id { get; set; }
        public Guid ExtractedVideoId { get; set; }
        public int StartInSeconds { get; set; }
        public int EndInSeconds { get; set; }
        public string Summery { get; set; }
        public string PrimaryTopic { get; set; }
        public int LanguageId { get; set; }


        public ExtractedVideo ExtractedVideo { get; set; }
        public List<VideoSegmentTag> VideoSegmentTags { get; set; }
        public List<SegmentQuestion> SegmentQuestions { get; set; }
        public Language Language { get; set; }
    }
}
