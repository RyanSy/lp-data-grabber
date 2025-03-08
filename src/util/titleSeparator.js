export function getCharactersBefore(str, char) {
    const index = str.indexOf(char);
    if (index === -1) {
      return str; // Character not found, return the whole string
    }
    return str.substring(0, index);
}

export function getCharactersAfter(str, char) {
    const index = str.indexOf(char);
    if (index === -1) {
      return ""; // Character not found
    }
    return str.substring(index + 1);
}