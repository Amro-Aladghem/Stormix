using Domain.Interfaces;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repository
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly AppDbContext _appDbContext;
        private Lazy<IAddVideoRequestRepository> _addVideoRequestRepository;
        private Lazy<IExtractedVideoRepository> _extractedVideoRepository;

        public ManagerRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;

            _addVideoRequestRepository = new Lazy<IAddVideoRequestRepository>(() =>
                new AddVideoRequestRepository(appDbContext));
            _extractedVideoRepository = new Lazy<IExtractedVideoRepository>(()=>
                new ExtractedVideoRepository(appDbContext));
        }

        public IAddVideoRequestRepository AddVideoRequestRepository => _addVideoRequestRepository.Value;
        public IExtractedVideoRepository ExtractedVideoRepository=>_extractedVideoRepository.Value;

        public async Task<bool> SaveAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }
    }
}
