// components/YouTubeEmbed.tsx
import React from "react";

interface YouTubeEmbedProps {
  videoId: string; // YouTube video ID
  title: string;
  autoplay?: boolean; // Optional autoplay parameter
  controls?: boolean; // Optional controls parameter
  mute?: boolean; // Optional mute parameter
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = (props) => {
  const {
    videoId,
    title,
    autoplay = false,
    controls = false,
    mute = false,
  } = props;

  // Add autoplay, controls, mute, modestbranding, fullscreen, and captions parameters to the URL if specified
  const autoplayParam = autoplay ? "autoplay=1" : "";
  const controlsParam = controls ? "controls=1" : "controls=0"; // Hide controls
  const muteParam = mute ? "mute=1" : "";
  const modestbrandingParam = "modestbranding=1"; // Minimizes YouTube branding
  const captionsParam = "cc_load_policy=0"; // Disable captions

  // Combine all parameters with '&' and remove leading '&' if no parameters
  const params = [
    autoplayParam,
    controlsParam,
    muteParam,
    modestbrandingParam,
    captionsParam,
  ]
    .filter((param) => param !== "")
    .join("&");

  const src = `https://www.youtube.com/embed/${videoId}?${params}`;

  return (
    <div className="relative w-full h-0" style={{ paddingTop: "56.25%" }}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 w-full h-full object-cover"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeEmbed;
