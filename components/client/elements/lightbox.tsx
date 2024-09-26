import React, { FC } from "react";
import FsLightbox from "fslightbox-react";

interface PageProps {
  show: boolean;
  images: string[] | [];
  video?: string;
  slideIndex?: number;
}

const Lightbox: FC<PageProps> = (props) => {
  return (
    <FsLightbox
      toggler={props.show}
      sources={props.video ? [props.video, ...props.images] : props.images}
      slide={props.video ? (props.slideIndex ?? 0) + 1 : props.slideIndex ?? 0}
    />
  );
};

export default Lightbox;
