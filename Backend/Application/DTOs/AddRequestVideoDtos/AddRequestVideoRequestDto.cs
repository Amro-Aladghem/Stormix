using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Application.DTOs.AddRequestVideoDtos
{
    public record AddRequestVideoRequestDto
    {
        [Required]
        public string Url { get; set; }

        [Required]
        public string Email { get; set; }
    }
}
