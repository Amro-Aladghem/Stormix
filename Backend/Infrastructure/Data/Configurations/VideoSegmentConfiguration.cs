using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.Configurations
{
    public class VideoSegmentConfiguration : IEntityTypeConfiguration<VideoSegment>
    {
        public void Configure(EntityTypeBuilder<VideoSegment> builder)
        {
            builder.Property(p => p.Id).ValueGeneratedNever();
        }
    }
}
