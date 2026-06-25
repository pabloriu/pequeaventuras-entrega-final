export function formatCurrency(value) {
  return `S/ ${Number(value || 0).toFixed(2)}`;
}

export function productCategoryText(product) {
  return product.categoria || product.categorias || 'Sin categoria';
}
