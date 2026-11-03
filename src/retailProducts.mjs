export const retailCategories = ['Protection', 'Power', 'Audio', 'Other'];
export const deliverooStoreUrl = 'https://deliveroo.co.uk/menu/london/catford/itop-phones-and-repair-center';

export function validateRetailProducts(input) {
  if (!Array.isArray(input)) throw new Error('Retail catalogue must be a product list.');
  const ids = new Set();
  for (const product of input) {
    if (!product || typeof product !== 'object' || !/^[a-z0-9-]{1,80}$/.test(product.id ?? '') || ids.has(product.id) ||
      typeof product.name !== 'string' || !product.name.trim() || product.name.length > 160 ||
      !retailCategories.includes(product.category) || !['draft', 'published'].includes(product.status) ||
      !['confirm', 'available', 'unavailable'].includes(product.availability) ||
      !(product.pricePence === null || (Number.isSafeInteger(product.pricePence) && product.pricePence > 0)) ||
      (product.status === 'published' && product.pricePence === null) ||
      typeof product.compatibility !== 'string' || product.compatibility.length > 500 ||
      typeof product.description !== 'string' || product.description.length > 1500 ||
      !(product.image === null || (typeof product.image === 'string' && /^images\/retail\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(product.image))) ||
      typeof product.checkedAt !== 'string' || (product.status === 'published' && !/^\d{4}-\d{2}-\d{2}$/.test(product.checkedAt))) {
      throw new Error('Invalid retail product: ' + (product?.id ?? 'missing ID'));
    }
    if (product.checkedAt && (!/^\d{4}-\d{2}-\d{2}$/.test(product.checkedAt) || new Date(product.checkedAt+'T00:00:00Z').toISOString().slice(0,10) !== product.checkedAt)) throw new Error('Invalid retail check date: ' + product.id);
    ids.add(product.id);
  }
  return input;
}

export function publishedRetailProducts(input) {
  return validateRetailProducts(input).filter(product => product.status === 'published');
}

export function filterRetailProducts(products, query, category) {
  const search = query.trim().toLowerCase();
  return products.filter(product => (category === 'All' || product.category === category) &&
    [product.name, product.compatibility, product.description].join(' ').toLowerCase().includes(search));
}

export const retailMoney = pricePence => new Intl.NumberFormat('en-GB', {style:'currency',currency:'GBP'}).format(pricePence / 100);
