using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Application.DTOs.QdrantSearchDtos
{
    public class QdrantResponse
    {
        public List<QdrantResult> Result { get; set; } = new();
    }

    public class QdrantResult
    {
        public Guid Id { get; set; }
        public float Score { get; set; }
        public Dictionary<string, JsonElement> Payload { get; set; } = new();
    }
}
