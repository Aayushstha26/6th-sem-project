/**
 * Custom sorting function to get top-rated products using selection sort algorithm.
 * @param {Array} products - The array of products to sort.
 * @param {number} limit - The number of products to return.
 * @returns {Array} - The sorted and limited array of products.
 */
export const getTopRatedProductsManual = (products, limit = 4) => {
  // Filter out products with zero or no ratings
  const ratedProducts = products.filter(product => 
    product.averageRating && product.averageRating > 0
  );
  
  const n = ratedProducts.length;
  
  // Create a shallow copy to avoid mutating the original array
  const sortedProducts = [...ratedProducts];

  // Selection Sort in descending order based on averageRating
  for (let i = 0; i < n - 1; i++) {
    let maxIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (sortedProducts[j].averageRating > sortedProducts[maxIdx].averageRating) {
        maxIdx = j;
      }
    }
    // Swap the elements
    if (maxIdx !== i) {
      [sortedProducts[i], sortedProducts[maxIdx]] = [sortedProducts[maxIdx], sortedProducts[i]];
    }
  }

  // Return the limited number of products
  return sortedProducts.slice(0, limit);
};
