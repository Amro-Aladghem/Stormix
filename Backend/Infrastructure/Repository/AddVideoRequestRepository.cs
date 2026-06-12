using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repository
{
    public class AddVideoRequestRepository : RepositoryBase<AddVideoRequest>, IAddVideoRequestRepository
    {
        public AddVideoRequestRepository(AppDbContext appDbContext) : base(appDbContext) { }
        public void CreateVideoRequest(AddVideoRequest addVideoRequest)
        {
            Create(addVideoRequest);
        }
    }
}
