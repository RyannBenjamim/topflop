import { useEffect, useState } from "react";

type LoadedImage = {
  url?: string;
  img: string | null;
}

export function useImageLoader(imgUrl?: string) {
  const [loaded, setLoaded] = useState<LoadedImage>({ img: null });

  useEffect(() => {
    if (!imgUrl) return;

    let isMounted = true;

    const image = new Image();

    image.onload = () => {
      if (isMounted) setLoaded({ url: imgUrl, img: imgUrl });
    };

    image.onerror = () => {
      if (isMounted) setLoaded({ url: imgUrl, img: null });
    };

    image.src = imgUrl;

    return () => {
      isMounted = false;
    };
  }, [imgUrl]);

  const isCurrent = Boolean(imgUrl) && loaded.url === imgUrl;

  return {
    img: isCurrent ? loaded.img : null,
    loadingImg: Boolean(imgUrl) && !isCurrent,
  };
}
