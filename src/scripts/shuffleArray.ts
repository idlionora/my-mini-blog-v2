function shuffleArray<T>(inputArr: T[]):T[] {
const processArr = [...inputArr];
let lengthCount = inputArr.length;
const resultArr:T[] = [];

function shiftItem(array: T[], length:number) {
    const randomIndex = Math.floor(Math.random() * length);
    resultArr.push(array[randomIndex]);
    array.splice(randomIndex, 1);
}

while (lengthCount > 0) {
    shiftItem(processArr, lengthCount)
    lengthCount--
}

return resultArr
}

export default shuffleArray;
