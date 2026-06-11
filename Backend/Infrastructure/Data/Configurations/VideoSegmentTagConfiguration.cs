using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.Configurations
{
    public class VideoSegmentTagConfiguration : IEntityTypeConfiguration<VideoSegmentTag>
    {
        public void Configure(EntityTypeBuilder<VideoSegmentTag> builder)
        {
            throw new NotImplementedException();
        }
    }
}
