import React, { useState, useEffect } from 'react';
import { Play, ExternalLink } from 'lucide-react';

const YouTubeVideoPanel = ({ recipes }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recipes.length > 0) {
      fetchVideos();
    }
  }, [recipes]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const API_KEY = import.meta.env.VITE_APP_YOUTUBE_API_KEY;
      const videoPromises = recipes.map(async (recipe) => {
        const query = `${recipe.title} recipe cooking`;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`
        );
        const data = await response.json();
        return data.items?.[0] || null;
      });

      const videoResults = await Promise.all(videoPromises);
      setVideos(videoResults.filter(video => video !== null));
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Videos</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-24 mb-2"></div>
              <div className="bg-gray-200 rounded h-4 mb-1"></div>
              <div className="bg-gray-200 rounded h-3 w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Play className="h-5 w-5 text-red-500" />
        Recipe Videos ({videos.length})
      </h3>
      
      {videos.length === 0 ? (
        <p className="text-gray-500 text-sm">No videos available</p>
      ) : (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-4 pr-2">
          {videos.map((video, index) => (
            <div key={video.id.videoId} className="group cursor-pointer">
              <a
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-500 rounded-full p-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Play className="h-4 w-4 text-white fill-current" />
                    </div>
                  </div>
                </div>
                <h4 className="text-sm font-medium text-gray-900 mt-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {video.snippet.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{video.snippet.channelTitle}</p>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YouTubeVideoPanel;