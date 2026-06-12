using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Application.DTOs.QdrantSearchDtos
{
    public record SearchRequestDto
    {
        [Required]
        public string text { get; set; }

        [Required]
        public string[] tags { get; set; }
    }
}
