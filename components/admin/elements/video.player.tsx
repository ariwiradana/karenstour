import ShimmerLoader from "@/components/client/elements/shimmer.loader";
import React, { useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  className = "",
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <div
      className={`flex justify-center items-center bg-gray-100 rounded overflow-hidden ${className}`}
    >
      <div className={`relative ${className}`}>
        {loading && <ShimmerLoader />}
        <video
          playsInline
          className="absolute top-0 left-0 w-full h-full aspect-video"
          src={videoUrl}
          muted
          onLoadedData={() => setLoading(false)}
          loop
          controls={false}
          autoPlay
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
