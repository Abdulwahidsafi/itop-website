import { useState } from 'react';
import { modelPhoto } from './modelPhotos.mjs';

export function PhoneModelPhoto({ brand, model, priority = false }: { brand: string; model: string; priority?: boolean }) {
  const photo = modelPhoto(brand, model);
  const [failedSrc, setFailedSrc] = useState('');
  return <span className="model-photo">{photo && failedSrc !== photo.src ? <img src={photo.src} alt={model} loading={priority ? 'eager' : 'lazy'} decoding="async" referrerPolicy="no-referrer" width="360" height="280" onError={() => setFailedSrc(photo.src)} /> : <span className="model-photo-unavailable">Photo unavailable</span>}</span>;
}

export function ModelPhotoCredit({ brand, model }: { brand: string; model: string }) {
  const photo = modelPhoto(brand, model);
  return photo ? <span className="model-photo-credit">Model reference · colours may vary. <a href={photo.source} target="_blank" rel="noreferrer">Image source</a></span> : null;
}
