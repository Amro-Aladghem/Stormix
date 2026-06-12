using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Interfaces
{
    public interface IAddVideoRequestRepository
    {
        void CreateVideoRequest(AddVideoRequest addVideoRequest);
    }
}
