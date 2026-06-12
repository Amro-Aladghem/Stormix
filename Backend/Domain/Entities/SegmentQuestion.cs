using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class SegmentQuestion
    {
        public int Id { get; set; } 
        public Guid VideoSegmentId { get; set; }
        public string Text { get; set; }

        public VideoSegment VideoSegment { get; set; } 
    }
}

//insert into SegmentQuestions (Id,VideoSegmentId,Text)
//values
