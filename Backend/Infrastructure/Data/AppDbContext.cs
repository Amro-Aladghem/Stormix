using Domain.Entities;
using Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Infrastructure.Data
{
    public class AppDbContext : DbContext 
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AssemblyReference).Assembly);

            foreach (var foreignKey in modelBuilder.Model
                                           .GetEntityTypes()
                                           .SelectMany(e => e.GetForeignKeys()))
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }

        public DbSet<AddVideoRequest> AddVideoRequests { get; set; }
        public DbSet<ExtractedVideo> ExtractedVideos { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<SegmentQuestion> SegmentQuestions { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<VideoSegment> VideoSegments { get; set; }
    }
}
