using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.Configurations
{
    public class SegmentQuestionConfiguration : IEntityTypeConfiguration<SegmentQuestion>
    {
        public void Configure(EntityTypeBuilder<SegmentQuestion> builder)
        {
            builder.HasKey(sq => sq.Id);
            builder.Property(sq => sq.Text).HasMaxLength(1000);
            builder.Property(sq => sq.VideoSegmentId).IsRequired();

            builder.HasOne(sq => sq.VideoSegment)
                   .WithMany(vs => vs.SegmentQuestions)
                   .HasForeignKey(sq => sq.VideoSegmentId);
        }
    }
}
