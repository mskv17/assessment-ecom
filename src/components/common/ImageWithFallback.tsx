import React, { useState } from 'react'
import { Utensils } from 'lucide-react'

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatioClass?: string;
  isPriority?: boolean; // For LCP elements like hero images (avoids lazy loading)
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Product image',
  fallbackSrc,
  aspectRatioClass = 'aspect-square',
  isPriority = false,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
    }
  }

  const handleLoad = () => {
    setIsLoaded(true)
  }

  return (
    <div
      className={`relative overflow-hidden bg-stone-100 ${aspectRatioClass} ${className}`}
    >
      {/* Shimmer skeleton while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-shimmer" />
      )}

      {hasError ? (
        fallbackSrc ? (
          <img
            src={fallbackSrc}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleLoad}
            {...props}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-4 text-stone-400 bg-stone-100/90 text-center select-none"
            role="img"
            aria-label={`${alt} (Image unavailable)`}
          >
            <div className="w-12 h-12 rounded-full bg-stone-200/80 flex items-center justify-center mb-2">
              <Utensils className="w-6 h-6 text-stone-400" />
            </div>
            <span className="text-xs font-medium text-stone-500">Image not available</span>
          </div>
        )
      ) : (
        <img
          src={src}
          alt={alt}
          loading={isPriority ? 'eager' : 'lazy'}
          decoding={isPriority ? 'sync' : 'async'}
          fetchPriority={isPriority ? 'high' : 'auto'}
          onError={handleError}
          onLoad={handleLoad}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          {...props}
        />
      )}
    </div>
  )
}
