import './index.css';

import { requestExpandedMode } from '@devvit/web/client';
import { context } from '@devvit/web/client';
import { useState } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

type RedditPost = {
  id: string;
  title: string;
  subreddit?: string;
  author?: string;
  url?: string;
  score?: number;
  numComments?: number;
};

type RedditComment = {
  id: string;
  body: string;
  author?: string;
  score?: number;
};

type SentimentSummary = {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  positivePercent: number;
  negativePercent: number;
  neutralPercent: number;
};

export const Splash = () => {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<RedditPost[]>([]);

  const [comments, setComments] = useState<RedditComment[]>([]);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [sentimentLoading, setSentimentLoading] = useState(false);

  const [sentiment, setSentiment] =
    useState<SentimentSummary | null>(null);

  const [error, setError] = useState('');

  const searchReddit = async () => {
    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setPosts([]);
      setComments([]);
      setSelectedPost(null);
      setSentiment(null);

      const response = await fetch(
        `/api/reddit-search?query=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Reddit search failed.'
        );
      }

      setPosts(data.posts || []);
    } catch (err) {
      console.error('Reddit search error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (postId: string) => {
    try {
      setCommentsLoading(true);
      setSentimentLoading(true);

      setComments([]);
      setSentiment(null);
      setSelectedPost(postId);
      setError('');

      console.log('Loading comments for:', postId);

      const response = await fetch(
        `/api/reddit-comments?postId=${encodeURIComponent(postId)}`
      );

      const data = await response.json();

      console.log('Comments response:', data);

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load comments.'
        );
      }

      setComments(data.comments || []);
      setCommentsLoading(false);

      console.log(
        'Comments loaded:',
        data.comments?.length || 0
      );

      // Analyze sentiment
      const sentimentResponse = await fetch(
        '/api/reddit-sentiment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comments: data.comments || [],
          }),
        }
      );

      const sentimentData = await sentimentResponse.json();

      console.log(
        'Sentiment response:',
        sentimentData
      );

      if (!sentimentResponse.ok) {
        throw new Error(
          sentimentData.message ||
            'Sentiment analysis failed.'
        );
      }

      setSentiment(sentimentData.summary);
      await fetch('/api/reddit-import', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    businessName: query,
    redditPostId: postId,
    title:
      posts.find((post) => post.id === postId)?.title || '',
    subreddit:
      posts.find((post) => post.id === postId)?.subreddit || '',
    postScore:
      posts.find((post) => post.id === postId)?.score || 0,
    commentCount: data.comments?.length || 0,
    comments: data.comments || [],
    sentiment: sentimentData.summary,
  }),
});
    } catch (error) {
      console.error(
        'Comments/Sentiment error:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load comments.'
      );
    } finally {
      setCommentsLoading(false);
      setSentimentLoading(false);
    }
  };

  return (
    <div className="flex relative flex-col items-center min-h-screen gap-5 bg-white dark:bg-gray-900 p-6">

      {/* TITLE */}

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        SentimentServe AI
      </h1>

      <p className="text-center text-gray-600 dark:text-gray-300">
        Reddit Social Intelligence
      </p>

      <p className="text-sm text-gray-500">
        Hey {context.username ?? 'user'} 👋
      </p>

      {/* SEARCH */}

      <div className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Search Reddit..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchReddit();
            }
          }}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black"
        />

        <button
          onClick={searchReddit}
          disabled={loading}
          className="bg-[#d93900] text-white px-4 py-2 rounded-lg"
        >
          {loading
            ? 'Searching...'
            : 'Search'}
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="w-full max-w-md bg-red-100 border border-red-300 rounded-lg p-3">
          <p className="text-red-700 text-sm">
            {error}
          </p>
        </div>
      )}

      {/* REDDIT POSTS */}

      <div className="w-full max-w-md">

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Reddit Posts
        </h2>

        {posts.length === 0 && !loading && (
          <p className="text-gray-500">
            Search for something like
            "restaurants".
          </p>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() =>
              loadComments(post.id)
            }
            className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
          >
            <h2 className="font-semibold text-gray-900">
              {post.title}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              r/{post.subreddit}
            </p>

            <p className="text-sm text-gray-500">
              👍 {post.score ?? 0}
              {' · '}
              💬 {post.numComments ?? 0}
            </p>

            <p className="text-xs text-[#d93900] mt-2">
              Click to analyze comments →
            </p>
          </div>
        ))}
      </div>

      {/* COMMENTS */}

      {selectedPost && (
        <div className="w-full max-w-md">

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            💬 Reddit Comments
          </h2>

          {commentsLoading && (
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-white">
                Loading comments...
              </p>
            </div>
          )}

          {!commentsLoading &&
            comments.length === 0 && (
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-white">
                  No comments found.
                </p>
              </div>
            )}

          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white border border-gray-200 rounded-lg p-3 mb-2"
            >
              <p className="text-gray-800">
                {comment.body}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                u/
                {comment.author ||
                  'unknown'}
                {' · '}
                👍 {comment.score ?? 0}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* SOCIAL SENTIMENT */}

      {selectedPost && (
        <div className="w-full max-w-md">

          <div className="bg-gray-800 rounded-lg p-5">

            <h2 className="text-xl font-bold text-white mb-4">
              📊 Reddit Social Sentiment
            </h2>

            {sentimentLoading && (
              <p className="text-gray-300">
                Analyzing Reddit comments...
              </p>
            )}

            {!sentimentLoading &&
              sentiment && (
                <div>

                  <div className="mb-3">
                    <p className="text-green-400 font-semibold">
                      😊 Positive:{' '}
                      {sentiment.positivePercent}%
                    </p>

                    <p className="text-gray-300">
                      😐 Neutral:{' '}
                      {sentiment.neutralPercent}%
                    </p>

                    <p className="text-red-400 font-semibold">
                      😞 Negative:{' '}
                      {sentiment.negativePercent}%
                    </p>
                  </div>

                  <p className="text-gray-300 text-sm">
                    Analyzed{' '}
                    {sentiment.total}{' '}
                    Reddit comments
                  </p>

                </div>
              )}

          </div>

        </div>
      )}

      {/* EXPANDED MODE */}

      <button
        onClick={(e) =>
          requestExpandedMode(
            e.nativeEvent,
            'game'
          )
        }
        className="bg-gray-800 text-white px-4 py-2 rounded-full"
      >
        Open Expanded Mode
      </button>

    </div>
  );
};

createRoot(
  document.getElementById('root')!
).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);