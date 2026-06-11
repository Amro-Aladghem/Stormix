using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.Configurations
{
    public class AddVideoRequestConfiguration : IEntityTypeConfiguration<AddVideoRequest>
    {
        public void Configure(EntityTypeBuilder<AddVideoRequest> builder)
        {
            builder.Property(p => p.RequestedVideoUrl).HasMaxLength(1000);
            throw new NotImplementedException();
        }
    }
}
