export function getImageUrl(image) {
  if (!image) return '/placeholder-product.png';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const backendUrl = apiUrl.replace(/\/api\/?$/, '');

  return `${backendUrl}${image.startsWith('/') ? image : `/${image}`}`;
}

export function handleImageError(event) {
  event.currentTarget.src = '/placeholder-product.png';
}
