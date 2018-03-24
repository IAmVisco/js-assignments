function propagateItemsByPositionIndex(arr) {
   return arr.map(x => x.repeat(arr.indexOf(x) + 1));
}
var arr = [ 1];
console.log(propagateItemsByPositionIndex(arr));