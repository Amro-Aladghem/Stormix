using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;
using Mscc.GenerativeAI;
using Mscc.GenerativeAI.Types;

namespace Infrastructure.ExternalServices
{
    public class AiEmbeddingService
    {
        private readonly IConfiguration _configuration;
        private readonly GoogleAI _googleAI;
        private readonly GenerativeModel _model;

        public AiEmbeddingService(IConfiguration configuration, GoogleAI googleAI)
        {
            _configuration = configuration;
            _googleAI = googleAI;
            _model = _googleAI.GenerativeModel(model: Model.GeminiEmbedding001);
        }

        public async Task<List<float>> GetEmbeddingTextResult(string text)
        {
            EmbedContentRequest request = new EmbedContentRequest("")
            {
                OutputDimensionality = 256,
                Model = Model.GeminiEmbedding,
                Content = new ContentResponse(text),
                TaskType = TaskType.RetrievalQuery
            };

            var response = await _model.EmbedContent(request);

            return response?.Embedding?.Values ?? new List<float>();
        }


    }
}
