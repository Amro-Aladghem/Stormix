using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Interfaces
{
    public interface IManagerRepository
    {
        IAddVideoRequestRepository AddVideoRequestRepository { get;}
        IExtractedVideoRepository ExtractedVideoRepository { get; }

        Task<bool> SaveAsync();

    }
}
