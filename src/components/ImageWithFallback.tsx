import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
}

const ImageWithFallback = forwardRef<HTMLImageElement, ImageWithFallbackProps>(
  ({ src, alt, fallbackSrc, className, ...props }, ref) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const defaultFallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='150' y='100' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3EImage Not Available%3C/text%3E%3C/svg%3E";

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        setImgSrc(fallbackSrc || defaultFallback);
      }
    };

    const handleLoad = () => {
      setHasError(false);
    };

    // Reset when src changes
    React.useEffect(() => {
      setImgSrc(src);
      setHasError(false);
    }, [src]);

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        className={cn(
          hasError && 'opacity-70',
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    );
  }
);

ImageWithFallback.displayName = 'ImageWithFallback';

export default ImageWithFallback;