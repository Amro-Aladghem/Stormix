using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Tag
    {
        public int Id { get; set; } 
        public string Name { get; set; }

        public List<VideoSegment> VideoSegments { get; set; }
    }
}
