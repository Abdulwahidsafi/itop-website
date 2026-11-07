import { modelPhotoData } from './modelPhotoData.mjs';
/** @param {string} brand @param {string} model */
const key = (brand, model) => brand.trim().toLowerCase() + '/' + model.trim().toLowerCase();
const photos = new Map(modelPhotoData.map(photo => [key(photo.brand, photo.model), photo]));
/** Exact matches only: never substitute another size, generation or brand.
 * @param {string} brand @param {string} model */
export function modelPhoto(brand, model) { return photos.get(key(brand, model)) ?? null; }
export { modelPhotoData };
