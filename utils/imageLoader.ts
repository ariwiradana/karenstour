export const myImageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  return `https://your-cdn.com/${src}?w=${width}&q=${quality || 75}`;
};
