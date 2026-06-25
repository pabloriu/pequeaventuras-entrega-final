import { getImageUrl, handleImageError } from '../../utils/imageUrl.js';

function ImagePreview({ src, label = 'Vista previa' }) {
  return (
    <div className="image-preview">
      <span>{label}</span>
      <img src={getImageUrl(src)} alt={label} onError={handleImageError} />
    </div>
  );
}

export default ImagePreview;
