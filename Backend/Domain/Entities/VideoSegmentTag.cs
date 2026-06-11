using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class VideoSegmentTag
    {
        public int TagId { get; set; }
        public Guid VideoSegmentId { get; set; }

        public Tag Tag { get; set; }
        public VideoSegment VideoSegment { get; set; }   
    }
}
