using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Infrastructure.Repository
{
    public class ExtractedVideoRepository : RepositoryBase<ExtractedVideo>, IExtractedVideoRepository
    {
        public ExtractedVideoRepository(AppDbContext context) : base(context) { }
        public async Task<ExtractedVideo?> GetFullExtractedVideoInfoById(Guid VideoId)
        {
            ExtractedVideo? video = await FindByCondition(c => c.Id == VideoId, false)
                .Include(c => c.VideoSegments)
                .ThenInclude(s => s.SegmentQuestions)
                .Include(c => c.VideoSegments)
                .ThenInclude(s => s.Tags)
                .FirstOrDefaultAsync();

            return video;
        }
    }
}
