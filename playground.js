function toNumber(value, def) {
    if ((typeof value == 'number' || 
    	value instanceof Number || 
    	typeof parseInt(value) == 'number') && value != null)
    {
        return value;
    }
    else
        return def;
}
console.log(toNumber('test', 0));