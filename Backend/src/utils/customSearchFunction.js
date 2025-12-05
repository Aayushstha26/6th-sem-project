function customSearchFunction(text, searchTerm) {
    let tIndex = 0;
    let sIndex = 0;
    if(searchTerm.length === 0) return true;
    while (tIndex < text.length && sIndex < searchTerm.length) {
        if (text[tIndex] === searchTerm[sIndex]) {
            sIndex++;
        }
        tIndex++;
    }   
    return sIndex === searchTerm.length;
  } 

  export { customSearchFunction };