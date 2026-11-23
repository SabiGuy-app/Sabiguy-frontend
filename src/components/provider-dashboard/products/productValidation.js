export function validateProduct(product) {
  if (!product.name.trim()) return "Enter a product name.";
  if (!/^\d+(?:\.\d{1,2})?$/.test(product.price.trim()) || !Number.isFinite(Number(product.price))) {
    return "Enter a valid price with up to two decimal places.";
  }
  if (!/^[1-9]\d*$/.test(product.quantity.trim()) || !Number.isSafeInteger(Number(product.quantity))) {
    return "Enter a whole quantity greater than zero.";
  }
  return "";
}
