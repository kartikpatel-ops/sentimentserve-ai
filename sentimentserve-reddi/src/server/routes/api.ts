import { Hono } from 'hono';
const SENTIMENTSERVE_BACKEND =
  "http://localhost:5000";
  async function sendRedditDataToSentimentServe(data: {
  businessName?: string;
  redditPostId: string;
  title?: string;
  subreddit?: string;
  postScore?: number;
  commentCount?: number;
  comments?: unknown[];
  sentiment?: unknown;
}) {
  const response = await fetch(
    `${SENTIMENTSERVE_BACKEND}/api/reddit/import`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      `SentimentServe backend returned ${response.status}`
    );
  }

  return await response.json();
}
import { context, redis, reddit } from '@devvit/web/server';
import type {
  DecrementResponse,
  IncrementResponse,
  InitResponse,
} from '../../shared/api';

type ErrorResponse = {
  status: 'error';
  message: string;
};

export const api = new Hono();
const positiveWords = [
  'good',
  'great',
  'excellent',
  'amazing',
  'awesome',
  'love',
  'loved',
  'best',
  'delicious',
  'perfect',
  'friendly',
  'helpful',
  'nice',
  'wonderful',
  'fantastic',
  'recommend',
];

const negativeWords = [
  'bad',
  'terrible',
  'awful',
  'worst',
  'hate',
  'hated',
  'poor',
  'horrible',
  'disappointing',
  'disappointed',
  'rude',
  'slow',
  'expensive',
  'dirty',
  'avoid',
  'waste',
];

const analyzeSentiment = (text: string) => {
  const words = text.toLowerCase().split(/\W+/);

  let positive = 0;
  let negative = 0;

  for (const word of words) {
    if (positiveWords.includes(word)) {
      positive++;
    }

    if (negativeWords.includes(word)) {
      negative++;
    }
  }

  if (positive > negative) {
    return 'positive';
  }

  if (negative > positive) {
    return 'negative';
  }

  return 'neutral';
};

api.get('/init', async (c) => {
  const { postId } = context;

  if (!postId) {
    console.error('API Init Error: postId not found in devvit context');
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required but missing from context',
      },
      400
    );
  }

  try {
    const [count, username] = await Promise.all([
      redis.get('count'),
      reddit.getCurrentUsername(),
    ]);

    return c.json<InitResponse>({
      type: 'init',
      postId: postId,
      count: count ? parseInt(count) : 0,
      username: username ?? 'anonymous',
    });
  } catch (error) {
    console.error(`API Init Error for post ${postId}:`, error);
    let errorMessage = 'Unknown error during initialization';
    if (error instanceof Error) {
      errorMessage = `Initialization failed: ${error.message}`;
    }
    return c.json<ErrorResponse>(
      { status: 'error', message: errorMessage },
      400
    );
  }
});

api.post('/increment', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required',
      },
      400
    );
  }

  const count = await redis.incrBy('count', 1);
  return c.json<IncrementResponse>({
    count,
    postId,
    type: 'increment',
  });
});

api.post('/decrement', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required',
      },
      400
    );
  }

  const count = await redis.incrBy('count', -1);
  return c.json<DecrementResponse>({
    count,
    postId,
    type: 'decrement',
  });
});
api.get('/reddit-search', async (c) => {
  try {
    const query = c.req.query('query');

    if (!query) {
      return c.json(
        {
          status: 'error',
          message: 'Please provide a search query.',
        },
        400
      );
    }

    const posts = await reddit
      .searchPosts({
        query,
        sort: 'relevance',
        limit: 10,
      })
      .all();

    return c.json({
      status: 'success',
      query,
      count: posts.length,
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        subreddit: post.subredditName,
        author: post.authorName,
        url: post.permalink,
        score: post.score,
        numComments: post.numberOfComments,
      })),
    });
  } catch (error) {
    console.error('Reddit search error:', error);

    return c.json(
      {
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to search Reddit.',
      },
      500
    );
  }
});
api.get('/reddit-comments', async (c) => {
  try {
    const postId = c.req.query('postId');

    if (!postId) {
      return c.json(
        {
          status: 'error',
          message: 'Please provide a post ID.',
        },
        400
      );
    }

    const comments = await reddit
      .getComments({
        postId: postId as `t3_${string}`,
        limit: 25,
      })
      .all();

    return c.json({
      status: 'success',
      postId,
      count: comments.length,
      comments: comments.map((comment) => ({
        id: comment.id,
        body: comment.body,
        author: comment.authorName,
        score: comment.score,
      })),
    });
  } catch (error) {
    console.error('Reddit comments error:', error);

    return c.json(
      {
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch Reddit comments.',
      },
      500
    );
  }
});
api.post('/reddit-sentiment', async (c) => {
  try {
    const body = await c.req.json();

    const comments = body.comments;

    if (!Array.isArray(comments)) {
      return c.json(
        {
          status: 'error',
          message: 'Comments array is required.',
        },
        400
      );
    }

    const analyzedComments = comments.map((comment) => ({
      ...comment,
      sentiment: analyzeSentiment(comment.body || ''),
    }));

    const positive = analyzedComments.filter(
      (comment) => comment.sentiment === 'positive'
    ).length;

    const negative = analyzedComments.filter(
      (comment) => comment.sentiment === 'negative'
    ).length;

    const neutral = analyzedComments.filter(
      (comment) => comment.sentiment === 'neutral'
    ).length;

    const total = analyzedComments.length;

    return c.json({
      status: 'success',
      summary: {
        total,
        positive,
        negative,
        neutral,
        positivePercent:
          total > 0 ? Math.round((positive / total) * 100) : 0,
        negativePercent:
          total > 0 ? Math.round((negative / total) * 100) : 0,
        neutralPercent:
          total > 0 ? Math.round((neutral / total) * 100) : 0,
      },
      comments: analyzedComments,
    });
  } catch (error) {
    console.error('Reddit sentiment error:', error);

    return c.json(
      {
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to analyze sentiment.',
      },
      500
    );
  }
});
// ===============================
// SEND REDDIT DATA TO SENTIMENTSERVE
// ===============================

api.post('/reddit-import', async (c) => {
  try {
    const body = await c.req.json();

    if (!body.redditPostId) {
      return c.json(
        {
          status: 'error',
          message: 'redditPostId is required.',
        },
        400
      );
    }

    const result =
      await sendRedditDataToSentimentServe({
        businessName: body.businessName,
        redditPostId: body.redditPostId,
        title: body.title,
        subreddit: body.subreddit,
        postScore: body.postScore,
        commentCount: body.commentCount,
        comments: body.comments || [],
        sentiment: body.sentiment || {},
      });

    return c.json({
      status: 'success',
      message: 'Reddit data sent to SentimentServe successfully.',
      data: result.data,
    });
  } catch (error) {
    console.error(
      'Reddit → SentimentServe error:',
      error
    );

    return c.json(
      {
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to send Reddit data.',
      },
      500
    );
  }
});