using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class AddVideoRequest
    {
        public int  Id { get; set; }
        public string RequestedVideoUrl { get; set; }
        public string? UserEmail { get; set; }
    }
}
