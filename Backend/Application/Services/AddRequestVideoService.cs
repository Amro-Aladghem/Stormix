using Application.DTOs.AddRequestVideoDtos;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class AddRequestVideoService
    {
        private readonly IManagerRepository _managerRepository;

        public AddRequestVideoService(IManagerRepository managerRepository)
        {
            _managerRepository = managerRepository;
        }
        
        public async Task<bool> CreateAddingRequestForVideo(AddRequestVideoRequestDto addRequestVideoRequestDto)
        {
            AddVideoRequest addVideoRequest = new AddVideoRequest()
            {
                RequestedVideoUrl = addRequestVideoRequestDto.Url,
                UserEmail = addRequestVideoRequestDto.Email
            };

            _managerRepository.AddVideoRequestRepository.CreateVideoRequest(addVideoRequest);
            return await _managerRepository.SaveAsync();
        }
    }
}
