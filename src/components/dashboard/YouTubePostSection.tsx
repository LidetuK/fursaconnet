import { useEffect, useState } from 'react';

export function YouTubePostSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [twitter, setTwitter] = useState<{ profile: any, tweets: any[] } | null>(null);
  const [twitterError, setTwitterError] = useState<string | null>(null);
  const [linkedinPosts, setLinkedinPosts] = useState<any[]>([]);
  const [linkedinError, setLinkedinError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYouTubeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://premium-promospace-production.up.railway.app/auth/youtube/channel', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setChannel(data.channel);
          setVideos(data.videos || []);
        }
      } catch (e: any) {
        setError(e.message);
      }
      setLoading(false);
    };
    fetchYouTubeData();
  }, []);

  useEffect(() => {
    const fetchTwitterData = async () => {
      setTwitterError(null);
      try {
        const res = await fetch('https://premium-promospace-production.up.railway.app/auth/twitter2/posts', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.error) {
          setTwitterError(data.error);
        } else {
          setTwitter(data);
        }
      } catch (e: any) {
        setTwitterError(e.message);
      }
    };
    fetchTwitterData();
  }, []);

  useEffect(() => {
    const fetchLinkedinPosts = async () => {
      setLinkedinError(null);
      try {
        const res = await fetch('https://premium-promospace-production.up.railway.app/auth/linkedin/posts', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.error) {
          setLinkedinError(data.error);
        } else {
          setLinkedinPosts(data.posts || []);
        }
      } catch (e: any) {
        setLinkedinError(e.message);
      }
    };
    fetchLinkedinPosts();
  }, []);

  return (
    <div className="space-y-8">
      {/* YouTube Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">YouTube Channel & Recent Videos</h2>
        {loading && <div>Loading YouTube data...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && channel && (
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              {channel.snippet?.thumbnails?.default?.url && (
                <img src={channel.snippet.thumbnails.default.url} alt="Channel" className="w-16 h-16 rounded-full" />
              )}
              <div>
                <h3 className="text-lg font-semibold">{channel.snippet?.title}</h3>
                <p className="text-sm text-gray-600">{channel.snippet?.description}</p>
                <p className="text-xs text-gray-500 mt-1">Subscribers: {channel.statistics?.subscriberCount}</p>
              </div>
            </div>
          </div>
        )}
        {!loading && !error && videos.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2">Recent Videos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video: any) => (
                <div key={video.id || video.contentDetails?.videoId} className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col items-center">
                  {video.snippet?.thumbnails?.medium?.url && (
                    <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="w-full h-40 object-cover rounded mb-2" />
                  )}
                  <div className="w-full">
                    <h5 className="text-md font-medium mb-1">{video.snippet?.title}</h5>
                    <p className="text-xs text-gray-500 mb-1">{new Date(video.snippet?.publishedAt).toLocaleDateString()}</p>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.contentDetails?.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-skilllink-green text-xs underline"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && !error && videos.length === 0 && (
          <div className="text-gray-500">No recent videos found.</div>
        )}
      </div>

      {/* Twitter Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Twitter Profile & Recent Tweets</h2>
        {twitterError && <div className="text-red-600">{twitterError}</div>}
        {!twitterError && twitter && twitter.profile && (
          <div className="mb-6 flex items-center gap-4">
            {twitter.profile.profile_image_url && (
              <img src={twitter.profile.profile_image_url} alt="Profile" className="w-16 h-16 rounded-full" />
            )}
            <div>
              <h3 className="text-lg font-semibold">@{twitter.profile.username}</h3>
              <p className="text-sm text-gray-600">{twitter.profile.name}</p>
              <p className="text-xs text-gray-500 mt-1">ID: {twitter.profile.id}</p>
            </div>
          </div>
        )}
        {!twitterError && twitter && twitter.tweets && twitter.tweets.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2">Recent Tweets</h4>
            <div className="space-y-4">
              {twitter.tweets.map((tweet: any) => (
                <div key={tweet.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <p className="text-gray-800 mb-2">{tweet.text}</p>
                  <p className="text-xs text-gray-500">Tweet ID: {tweet.id}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {!twitterError && twitter && (!twitter.tweets || twitter.tweets.length === 0) && (
          <div className="text-gray-500">No recent tweets found.</div>
        )}
      </div>

      {/* LinkedIn Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">LinkedIn Recent Posts</h2>
        {linkedinError && <div className="text-red-600">{linkedinError}</div>}
        {!linkedinError && linkedinPosts && linkedinPosts.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2">Recent LinkedIn Posts</h4>
            <div className="space-y-4">
              {linkedinPosts.map((post: any) => (
                <div key={post.id || post.activity} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <p className="text-gray-800 mb-2">
                    {post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || 'No text'}
                  </p>
                  <p className="text-xs text-gray-500">URN: {post.id || post.activity}</p>
                  <p className="text-xs text-gray-400">Last Modified: {post.lastModified?.time ? new Date(post.lastModified.time).toLocaleString() : 'N/A'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {!linkedinError && linkedinPosts && linkedinPosts.length === 0 && (
          <div className="text-gray-500">No recent LinkedIn posts found.</div>
        )}
      </div>
    </div>
  );
} 