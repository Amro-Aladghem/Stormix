using Application.DTOs.AddRequestVideoDtos;
using Application.DTOs.ExtracedVideoDtos;
using Application.DTOs.QdrantSearchDtos;
using Application.Services;
using Infrastructure.ExternalServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentation
{
    [ApiController]
    [Route("api/v1/videos")]
    public class VideoController : ControllerBase
    {
        private readonly SearchResultService _searchResultService;
        private readonly AddRequestVideoService _addRequestVideoService;
        private readonly VideoExtractedService _videoExtractedService;

        public VideoController(SearchResultService searchResultService,AddRequestVideoService addRequestVideoService, VideoExtractedService videoExtractedService)
        {
            this._searchResultService = searchResultService;
            _addRequestVideoService = addRequestVideoService;
            _videoExtractedService = videoExtractedService;
        }

        [HttpGet("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public async Task<ActionResult<List<SegmentSearchResultDto>>> GetSearchResults(SearchRequestDto searchRequestDto)
        {
            if (string.IsNullOrEmpty(searchRequestDto.text))
                return BadRequest(new { message = "The Text Search Is Empty" });

            var result = await _searchResultService.HandleGetSearchResultsWithFinalScores(searchRequestDto);
            return Ok(result);
        }

        [HttpPost("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public async Task<ActionResult<bool>> CreateAddRequestVideo([FromForm]AddRequestVideoRequestDto addRequestVideoRequestDto)
        {
            if (string.IsNullOrEmpty(addRequestVideoRequestDto.Url) || string.IsNullOrEmpty(addRequestVideoRequestDto.Email))
                return BadRequest(new { message = "Inputs are not valid" });

            var result = await _addRequestVideoService.CreateAddingRequestForVideo(addRequestVideoRequestDto);

            return Ok(result);
        }

        [HttpGet("{videoId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]

        public async Task<ActionResult<FullExtracedVideoDto>> GetFullExtractedVideoInfo(Guid videoId)
        {
            if (videoId == Guid.Empty)
                return BadRequest(new { message = "Invalid Data" });

            var info = await _videoExtractedService.GetFullExtractedVideoInfo(videoId);

            if (info is null)
                return NotFound(new { message = "No Video With This Id" });

            return Ok(info);
        }

    }
}
