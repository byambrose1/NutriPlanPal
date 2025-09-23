import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cva, type VariantProps } from "class-variance-authority";

const imageVariants = cva("", {
  variants: {
    objectFit: {
      fill: "object-fill",
      contain: "object-contain",
      cover: "object-cover",
      "scale-down": "object-scale-down",
      none: "object-none",
    },
    objectPosition: {
      center: "object-center",
      top: "object-top",
      "top-right": "object-top object-right",
      right: "object-right",
      "bottom-right": "object-bottom object-right",
      bottom: "object-bottom",
      "bottom-left": "object-bottom object-left",
      left: "object-left",
      "top-left": "object-top object-left",
    },
  },
  defaultVariants: {
    objectFit: "cover",
    objectPosition: "center",
  },
});

export interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "loading" | "onLoad" | "onError">,
    VariantProps<typeof imageVariants> {
  src: string;
  alt: string;
  aspectRatio?: number;
  sizes?: string;
  loading?: "lazy" | "eager";
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  fallbackSrc?: string;
  skeleton?: boolean;
  skeletonClassName?: string;
  priority?: boolean;
  quality?: number;
  srcSet?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    aspectRatio,
    sizes = "100vw",
    loading = "lazy",
    onLoad,
    onError,
    fallbackSrc,
    skeleton = true,
    skeletonClassName,
    priority = false,
    quality = 75,
    srcSet,
    placeholder = "empty",
    blurDataURL,
    objectFit,
    objectPosition,
    className,
    style,
    ...props
  }, ref) => {
    const [imageState, setImageState] = React.useState<"loading" | "loaded" | "error">("loading");
    const [imageSrc, setImageSrc] = React.useState<string>(src);
    const [isInView, setIsInView] = React.useState(!loading || loading === "eager" || priority);
    const imgRef = React.useRef<HTMLImageElement>(null);
    const placeholderRef = React.useRef<HTMLDivElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => imgRef.current as HTMLImageElement);

    // IntersectionObserver for lazy loading
    React.useEffect(() => {
      if (loading === "lazy" && !priority && !isInView) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
              }
            });
          },
          {
            rootMargin: "50px",
            threshold: 0.1,
          }
        );

        const currentPlaceholderRef = placeholderRef.current;
        if (currentPlaceholderRef) {
          observer.observe(currentPlaceholderRef);
        }

        return () => {
          if (currentPlaceholderRef) {
            observer.unobserve(currentPlaceholderRef);
          }
        };
      }
    }, [loading, priority, isInView]);

    // Generate responsive srcSet if not provided
    const generateSrcSet = React.useMemo(() => {
      if (srcSet) return srcSet;
      
      const breakpoints = [320, 480, 768, 1024, 1280, 1536];
      return breakpoints
        .map((width) => {
          const url = new URL(imageSrc, window.location.origin);
          url.searchParams.set('w', width.toString());
          if (quality !== 75) {
            url.searchParams.set('q', quality.toString());
          }
          return `${url.toString()} ${width}w`;
        })
        .join(', ');
    }, [imageSrc, srcSet, quality]);

    // Handle image load
    const handleLoad = React.useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
      setImageState("loaded");
      onLoad?.(event);
    }, [onLoad]);

    // Handle image error
    const handleError = React.useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
      setImageState("error");
      if (fallbackSrc && imageSrc !== fallbackSrc) {
        setImageSrc(fallbackSrc);
        setImageState("loading");
      }
      onError?.(event);
    }, [onError, fallbackSrc, imageSrc]);

    // Performance optimization: Preload critical images
    React.useEffect(() => {
      if (priority && isInView) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imageSrc;
        if (generateSrcSet) {
          link.setAttribute('imagesrcset', generateSrcSet);
        }
        if (sizes) {
          link.setAttribute('imagesizes', sizes);
        }
        document.head.appendChild(link);
        
        return () => {
          document.head.removeChild(link);
        };
      }
    }, [priority, isInView, imageSrc, generateSrcSet, sizes]);

    const imageElement = (
      <>
        {/* Loading skeleton */}
        {skeleton && imageState === "loading" && (
          <Skeleton 
            className={cn(
              "absolute inset-0 w-full h-full", 
              skeletonClassName
            )}
            data-testid="image-skeleton"
          />
        )}

        {/* Blur placeholder */}
        {placeholder === "blur" && blurDataURL && imageState === "loading" && (
          <img
            src={blurDataURL}
            alt=""
            className={cn(
              "absolute inset-0 w-full h-full scale-110 blur-sm transition-opacity duration-300",
              imageVariants({ objectFit, objectPosition })
            )}
            data-testid="image-blur-placeholder"
          />
        )}

        {/* Intersection observer placeholder for lazy loading */}
        {!isInView && (
          <div 
            ref={placeholderRef}
            className="absolute inset-0 w-full h-full"
            data-testid="intersection-placeholder"
          />
        )}

        {/* Main image */}
        {isInView && (
          <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            srcSet={generateSrcSet}
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full h-full transition-opacity duration-300",
              imageVariants({ objectFit, objectPosition }),
              imageState === "loaded" ? "opacity-100" : "opacity-0",
              className
            )}
            style={{
              ...style,
              // Add caching headers via inline styles for better performance
              filter: imageState === "loading" ? "blur(0px)" : undefined,
            }}
            role="img"
            aria-label={alt}
            data-testid="optimized-image"
            {...props}
          />
        )}

        {/* Error fallback */}
        {imageState === "error" && !fallbackSrc && (
          <div 
            className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center text-muted-foreground"
            data-testid="image-error-fallback"
          >
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">Failed to load image</p>
            </div>
          </div>
        )}
      </>
    );

    // Wrap with AspectRatio if specified
    if (aspectRatio) {
      return (
        <AspectRatio ratio={aspectRatio} className="relative overflow-hidden">
          {imageElement}
        </AspectRatio>
      );
    }

    // Return as relative container
    return (
      <div className="relative overflow-hidden">
        {imageElement}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export { OptimizedImage, imageVariants };