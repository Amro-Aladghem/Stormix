using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.Configurations
{
    public class ExtractedVideoConfiguration : IEntityTypeConfiguration<ExtractedVideo>
    {
        public void Configure(EntityTypeBuilder<ExtractedVideo> builder)
        {
            builder.Property(p => p.VideoUrl).HasMaxLength(1000);
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).ValueGeneratedNever();
            throw new NotImplementedException();
        }
    }
}
