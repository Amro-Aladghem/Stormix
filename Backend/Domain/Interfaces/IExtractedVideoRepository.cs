using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Interfaces
{
    public interface IExtractedVideoRepository
    {
        Task<ExtractedVideo?> GetFullExtractedVideoInfoById(Guid VideoId);
    }
}
