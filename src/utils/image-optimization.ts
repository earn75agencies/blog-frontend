/**
 * Image Optimization Utility
 * Automatically generates optimized image variants and lazy loading strategies
 */

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
  crop?: string;
  gravity?: string;
}

/**
 * Image optimization configuration
 */
export const imageOptimizationConfig = {
  sizes: {
    thumbnail: { width: 150, height: 150, quality: 80 },
    small: { width: 300, height: 300, quality: 80 },
    medium: { width: 600, height: 600, quality: 85 },
    large: { width: 1200, height: 1200, quality: 90 },
    original: { quality: 95 },
  },
  formats: ['webp', 'jpg', 'png'],
  loadingStrategy: 'lazy',
};

/**
 * Generate optimized image URL for Cloudinary
 */
export const generateOptimizedImageUrl = (publicId: string, options: ImageOptions = {}): string => {
  const { width, height, quality = 85, format = 'auto', crop = 'fill', gravity = 'auto' } = options;

  const cloudinaryUrl = `https://res.cloudinary.com/${
    process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
  }/image/upload`;

  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity) transformations.push(`g_${gravity}`);
  if (format) transformations.push(`f_${format}`);

  transformations.push('f_auto');

  return `${cloudinaryUrl}/${transformations.join(',')}/${publicId}`;
};

/**
 * Generate srcset for responsive images
 */
export const generateSrcSet = (publicId: string): string => {
  const sizes = [300, 600, 1200];
  return sizes
    .map((size) => `${generateOptimizedImageUrl(publicId, { width: size, height: size })} ${size}w`)
    .join(', ');
};

export default {
  imageOptimizationConfig,
  generateOptimizedImageUrl,
  generateSrcSet,
};
