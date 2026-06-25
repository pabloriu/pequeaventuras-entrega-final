export function buildWhatsappMessage(products) {
  const lines = products.map((product) => `- ${product.nombre}`);
  return `Hola, estoy interesado en los siguientes productos:\n${lines.join('\n')}`;
}

export function buildWhatsappUrl(number, products) {
  return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsappMessage(products))}`;
}
