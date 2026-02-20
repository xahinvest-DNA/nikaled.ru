"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = ImageProps & {
  fallbackSrc: string;
};

export const SmartImage = ({ src, fallbackSrc, alt, ...props }: Props) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  return <Image {...props} src={currentSrc} alt={alt} quality={95} onError={() => setCurrentSrc(fallbackSrc)} />;
};
