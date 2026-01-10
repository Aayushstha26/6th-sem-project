function isValidRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

function findUserRatingIndex(ratingsArray, userId) {
  for (let i = 0; i < ratingsArray.length; i++) {
    if (ratingsArray[i].user.toString() === userId.toString()) {
      return i;
    }
    }
    return -1;
}
function addOrUpdateRating(ratingsArray, userId, rating) {
    const index = findUserRatingIndex(ratingsArray, userId);
    if (index !== -1) {
        ratingsArray[index].rating = rating;
    } else {
        ratingsArray.push({ user: userId, rating: rating });
    }
    return ratingsArray;
}
function calculateAverageRating(ratingsArray) {
    if (ratingsArray.length === 0) return 0;
    let total = 0;
    for (const entry of ratingsArray) {
        total += entry.rating;
    }
    return total / ratingsArray.length;
}


export { isValidRating, addOrUpdateRating, calculateAverageRating };
