function getDigitalRoot(num) {
    let sum = 0;
    for (let digit of ""+num)
    {
        sum += Number(digit);
    }
    console.log(sum);
    if (sum > 9)
        return getDigitalRoot(sum);
    return sum;
}
console.log(getDigitalRoot(12345));