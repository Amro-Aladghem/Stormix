using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.QdrantSearchDtos
{
    public record SegmentSearchResultDto
    {
        public Guid Id { get; set; } 
        public float Score { get; set; }
        public SearchedSegmentDto Payload { get; set; }
    }
}
