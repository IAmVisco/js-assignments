function timeSpanToString(startDate, endDate) {
    var timespan = new Date(endDate - startDate);    
    return timespan.toISOString().slice(11, -1); 
}
startDate = new Date(2000,1,1,10,0,0);
endDate = new Date(2000,1,1,11,0,0);
console.log(timeSpanToString(startDate, endDate));