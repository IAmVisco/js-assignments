function* getFibonacciSequence() {
    let a = 1;
    let b = 0;
    while (b < 63245986) {
        let cur = b;
        b = a;
        a += cur;
        yield cur;
    }
}
for (let num of getFibonacciSequence())
	console.log(num);