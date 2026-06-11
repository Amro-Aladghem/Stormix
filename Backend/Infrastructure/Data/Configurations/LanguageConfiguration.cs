using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.Configurations
{
    public class LanguageConfiguration : IEntityTypeConfiguration<Language>
    {
        public void Configure(EntityTypeBuilder<Language> builder)
        {
            builder.HasKey(l => l.Id);
            builder.Property(l => l.Id).ValueGeneratedNever();

            builder.HasData(
                new Language { Id = 1, Name = "ar" }, 
                new Language { Id = 2, Name = "en" }, 
                new Language { Id = 3, Name = "es" }, 
                new Language { Id = 4, Name = "fr" }, 
                new Language { Id = 5, Name = "de" }, 
                new Language { Id = 6, Name = "zh" }, 
                new Language { Id = 7, Name = "tr" }, 
                new Language { Id = 8, Name = "it" }, 
                new Language { Id = 9, Name = "ru" }, 
                new Language { Id = 10, Name = "ja" },
                new Language { Id = 11, Name = "hi" },
                new Language { Id = 12, Name = "pt" },
                new Language { Id = 13, Name = "ko" },
                new Language { Id = 14, Name = "fa" },
                new Language { Id = 15, Name = "ur" } 
            );
        }
    }
}
