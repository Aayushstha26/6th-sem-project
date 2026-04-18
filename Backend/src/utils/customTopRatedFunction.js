
const quickSort = (arr, low, high) => {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
};

const partition = (arr, low, high) => {
  const pivot = arr[high].averageRating;
  let i = low - 1;

  for (let j = low; j < high; j++) {
    // Sort in descending order based on averageRating
    if (arr[j].averageRating > pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
};

export const getTopRatedProductsManual = (products, limit = 4) => {
  // Filter out products with zero or no ratings
  const ratedProducts = products.filter(product => 
    product.averageRating && product.averageRating > 0
  );
  
  // Create a shallow copy to avoid mutating the original array
  const sortedProducts = [...ratedProducts];

  // Quick Sort in descending order based on averageRating
  if (sortedProducts.length > 0) {
    quickSort(sortedProducts, 0, sortedProducts.length - 1);
  }

  // Return the limited number of products
  return sortedProducts.slice(0, limit);
};
