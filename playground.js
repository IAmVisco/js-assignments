function extractNameFromTemplate(value) {
    return value.slice(7, value.length - 1);
}

console.log(extractNameFromTemplate('Hello, John Doe!'));