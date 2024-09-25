import React, { useState } from "react";
import Image from "next/image";
import ShimmerLoader from "./shimmer.loader";

interface ImageShimmerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  onClick?: () => void;
}

const ImageShimmer: React.FC<ImageShimmerProps> = (props) => {
  const [loading, setLoading] = useState(true);

  return (
    <div
      onClick={props.onClick ? props.onClick : undefined}
      className="relative w-full h-full"
      style={{ height: props.width, width: props.height }}
    >
      {loading && <ShimmerLoader />}
      <Image
        priority={props.priority}
        fill={props.fill}
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        onLoad={() => setLoading(false)}
        className={`${props.className ?? ""} ${loading ? "hidden" : "block"}`}
      />
    </div>
  );
};

export default ImageShimmer;
