# Perplexity API Integration

This document describes the integration with Perplexity AI for lyrics search functionality.

## Overview

The lyrics search feature uses Perplexity AI's search-enabled language models to find song lyrics. The implementation follows Perplexity's official documentation and uses the OpenAI client library as recommended.

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```bash
PERPLEXITY_API_KEY=your_perplexity_api_key_here
PERPLEXITY_BASE_URL=https://api.perplexity.ai
```

### Getting an API Key

1. Sign up at [Perplexity AI](https://www.perplexity.ai/)
2. Navigate to the API section
3. Generate a new API key
4. Add it to your environment variables

## Implementation Details

### Client Setup

The service uses the OpenAI client library with Perplexity's base URL:

```typescript
this.openaiClient = new OpenAI({
  apiKey: this.perplexityApiKey,
  baseURL: perplexityBaseUrl,
});
```

### Model Selection

We use `sonar` which provides:
- Web search capabilities
- Real-time information access
- Cost-effective pricing
- Good performance for lyrics search

### Search Parameters

The implementation uses Perplexity-specific parameters:

```typescript
{
  model: 'sonar',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 2000,
  temperature: 0.1, // Low temperature for consistent results
  top_p: 0.9,
  // Perplexity-specific parameters
  return_citations: false,
  search_domain_filter: ['genius.com', 'azlyrics.com', 'lyrics.com'],
  return_images: false,
  return_related_questions: false,
  search_recency_filter: 'month',
  top_k: 0,
  stream: false,
  presence_penalty: 0,
  frequency_penalty: 1,
}
```

### Prompt Engineering

The prompt is designed to:
- Focus on lyrics-only content
- Filter out metadata and formatting
- Handle cases where lyrics aren't found
- Maintain original structure and line breaks

Example prompt:
```
Find the complete lyrics for "Amazing Grace" by John Newton.

IMPORTANT INSTRUCTIONS:
- Return ONLY the song lyrics, no additional commentary or information
- Do not include song title, artist name, or any metadata in the response
- Do not include verse/chorus labels or structural annotations like [Verse 1], [Chorus], etc.
- Do not include copyright information or disclaimers
- If the song has multiple verses and a chorus, include all of them in order
- Maintain the original line breaks and structure of the lyrics
- If you cannot find the exact lyrics, respond with "LYRICS_NOT_FOUND"
- Do not provide similar songs or alternatives
- Focus on finding the most accurate and complete version of the lyrics
```

## Error Handling

The service handles various error scenarios:

- **401 Unauthorized**: Invalid API key
- **429 Too Many Requests**: Rate limit exceeded
- **500+ Server Errors**: Perplexity API unavailable
- **Network Errors**: Connection issues
- **Not Found**: Lyrics not available

## Response Processing

1. **Content Cleaning**: Removes metadata, formatting, and unwanted text
2. **Confidence Scoring**: Calculates quality score based on content length and structure
3. **Validation**: Checks for "not found" indicators

## Testing

The implementation includes comprehensive tests:

- Unit tests for utility methods
- Integration tests for service initialization
- Controller tests for API endpoints
- Mock tests for error scenarios

Run tests with:
```bash
npm test -- --testPathPattern=lyrics
```

## Rate Limits

Perplexity API has rate limits. The service handles rate limit errors gracefully and returns appropriate HTTP status codes.

## Best Practices

1. **Caching**: Consider implementing caching for frequently requested lyrics
2. **Retry Logic**: Implement exponential backoff for transient errors
3. **Monitoring**: Monitor API usage and error rates
4. **Fallback**: Consider fallback mechanisms for when Perplexity is unavailable

## References

- [Perplexity API Documentation](https://docs.perplexity.ai/)
- [Chat Completions Guide](https://docs.perplexity.ai/guides/chat-completions-guide)
- [OpenAI Client Library](https://github.com/openai/openai-node)