function generateSalt(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let salt = "";
  for (let i = 0; i < length; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return salt;
}
function HashingFunction(str) {
  let h1 = 0, h2 = 0, h3 = 0, h4 = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    h1 = (h1 * 31 + code) % 1000000007;
    h2 = (h2 * 131 + code) % 1000000009;
    h3 = (h3 * 97 + code) % 1000000021;
    h4 = (h4 * 53 + code) % 1000000033;
  }
  // Combine 4 accumulators to get ~32 chars
  return (
    h1.toString(16).padStart(8, "0") +
    h2.toString(16).padStart(8, "0") +
    h3.toString(16).padStart(8, "0") +
    h4.toString(16).padStart(8, "0")
  );
}

function bcryptHash(password, salt, rounds = 1000) {
  let hash = password + salt;
  for (let r = 0; r < rounds; r++) {
    hash = HashingFunction(hash);
  }
  return { salt, hash };
}
function bcryptHashCompare(password, storedHash, salt, rounds = 1000) {
  let inputHash = bcryptHash(password, salt, rounds).hash;
  return inputHash === storedHash;
}

export { generateSalt, bcryptHash, bcryptHashCompare };