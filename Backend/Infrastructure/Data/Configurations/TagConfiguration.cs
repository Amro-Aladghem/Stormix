using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations
{
    public class TagConfiguration : IEntityTypeConfiguration<Tag>
    {
        public void Configure(EntityTypeBuilder<Tag> builder)
        {
            builder.Property(p => p.Id).ValueGeneratedNever();
            builder.HasData(
                new Tag { Id = 1, Name = "claude" },
                new Tag { Id = 2, Name = "cursor" },
                new Tag { Id = 3, Name = "codex" },
                new Tag { Id = 4, Name = "mcp" },
                new Tag { Id = 5, Name = "agents" },
                new Tag { Id = 6, Name = "skills" },
                new Tag { Id = 7, Name = "projects" },
                new Tag { Id = 8, Name = "artifacts" },
                new Tag { Id = 9, Name = "connectors" },
                new Tag { Id = 10, Name = "prompting" },
                new Tag { Id = 11, Name = "vision" },
                new Tag { Id = 12, Name = "web-search" },
                new Tag { Id = 13, Name = "automation" },
                new Tag { Id = 14, Name = "workflow" },
                new Tag { Id = 15, Name = "productivity" },
                new Tag { Id = 16, Name = "coding" },
                new Tag { Id = 17, Name = "integration" },
                new Tag { Id = 18, Name = "context" },
                new Tag { Id = 19, Name = "cli" },
                new Tag { Id = 20, Name = "api" },
                new Tag { Id = 21, Name = "sdk" },
                new Tag { Id = 22, Name = "authentication" },
                new Tag { Id = 23, Name = "deployment" },
                new Tag { Id = 24, Name = "hosting" },
                new Tag { Id = 25, Name = "pricing" },
                new Tag { Id = 26, Name = "subscription" },
                new Tag { Id = 27, Name = "account-setup" },
                new Tag { Id = 28, Name = "rag" },
                new Tag { Id = 29, Name = "vector-db" },
                new Tag { Id = 30, Name = "embeddings" },
                new Tag { Id = 31, Name = "tool-calling" },
                new Tag { Id = 32, Name = "memory" },
                new Tag { Id = 33, Name = "vibe-coding" },
                new Tag { Id = 34, Name = "code-generation" },
                new Tag { Id = 35, Name = "code-review" },
                new Tag { Id = 36, Name = "debugging" },
                new Tag { Id = 37, Name = "refactoring" },
                new Tag { Id = 38, Name = "testing" },
                new Tag { Id = 39, Name = "cursor-rules" },
                new Tag { Id = 40, Name = "agent-mode" },
                new Tag { Id = 41, Name = "codebase-chat" },
                new Tag { Id = 42, Name = "github" },
                new Tag { Id = 43, Name = "git" },
                new Tag { Id = 44, Name = "terminal" },
                new Tag { Id = 45, Name = "fastapi" },
                new Tag { Id = 46, Name = "nextjs" },
                new Tag { Id = 47, Name = "react" },
                new Tag { Id = 48, Name = "python" },
                new Tag { Id = 49, Name = "dotnet" },
                new Tag { Id = 50, Name = "typescript" }
            );
        }
    }
}
