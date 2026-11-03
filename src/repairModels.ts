import { repairBrands } from './repairCatalogue.mjs';

// These suggestions identify devices; they do not promise repair support or stock.
export function repairModels(device: string, brand: string): string[] {
  return device === 'Phone' ? repairBrands.find(item => item.name === brand)?.models.map(model => model.name) ?? [] : [];
}
