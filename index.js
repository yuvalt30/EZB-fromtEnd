function trimZero(arr) {
  const arrIndex = [];
  arr.forEach((value, i) => {
    value !== 0 && arrIndex.push(i);
  });
  return arr.slice(arrIndex[0], arrIndex[arrIndex.length - 1] + 1);
}

//
//
//
//
//
//
//
//
//

//
//
//
//
//
//
//
//
//
//
//
//
//
//
console.log(trimZero([0, 0, 0, 0, 3, 8, 8, 0, 9, 3, 4, 0, 0, 0, 4, 0, 0]));
console.log(trimZero([0, 3, 8, 8, 0, 9, 3, 4, 0, 0, 0, 4]));
