/**
 * Helper: Array peek
 */
Array.prototype.peek = function() {
  return this[this.length-1];
}

/**
 * Delete element and return new array
 * @param {*} element Element to delete
 */
Array.prototype.remove = function(element) {
  let array = [...this]
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
  return array
}