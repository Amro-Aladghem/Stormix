namespace Application.DTOs.QdrantSearchDtos
{
    public record SearchedSegmentDto
    {
        public Guid SegmentId { get; set; }
        public string VideoId { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string Summary { get; set; }
        public string PrimaryTopic { get; set; }
        public string[] Questions { get; set; }
        public string[] Tags { get; set; }
        public string Language { get; set; }
        public string Url { get; set; }
    }
}
