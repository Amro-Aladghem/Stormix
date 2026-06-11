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
            throw new NotImplementedException();
        }
    }
}
