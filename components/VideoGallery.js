import React, { useState, useEffect } from "react";

const videos = [
  { id: "video1", title: "How to Use Product 1", youtubeId: "aKFlAf6nHVU" },
  { id: "video2", title: "How to Use Product 2", youtubeId: "bGg5OZtzVsU" },
  { id: "video3", title: "How to Use Product 3", youtubeId: "cH3wnmSxGJM" },
  { id: "video4", title: "How to Use Product 4", youtubeId: "dV3nMq8jOZU" },
  { id: "video5", title: "How to Use Product 5", youtubeId: "eL4mWjUvHCY" },
];

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Close modal when pressing `Esc`
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeVideo();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Function to open the video in a modal
  const openVideo = (videoId) => {
    setSelectedVideo(videoId);
  };

  // Function to close video modal
  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="max-w-5xl mx-auto my-10">
      <h2 className="text-2xl font-bold text-center mb-6">📹 How to Use Our Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white shadow-md rounded-lg p-3 text-center">
            {/* Video Thumbnail (Click to Open) */}
            <div className="relative w-full h-48 cursor-pointer" onClick={() => openVideo(video.youtubeId)}>
              <iframe
                className="w-full h-full rounded-lg pointer-events-none"
                src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&showinfo=0`}
                title={video.title}
                allowFullScreen
              ></iframe>
            </div>
            {/* Video Title */}
            <h3 className="mt-2 text-lg font-semibold text-gray-800">{video.title}</h3>
          </div>
        ))}
      </div>

      {/* Video Modal (Popup) */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={closeVideo} // Close when clicking outside
        >
          <div
            className="transition-transform transform scale-90 hover:scale-100"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <iframe
              className="w-[900px] h-[500px] max-w-full max-h-[80vh] rounded-lg"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
