function getCommonDirectoryPath(pathes) {
    let newArr = pathes.concat(); 
    let a1 = newArr[0];
    let a2 = newArr[newArr.length - 1];
    let L = a1.length;
    let i = 0;
    while(i < L && a1.charAt(i) === a2.charAt(i)) 
        i++;
    for (let path of pathes)
        if (path[0] != '/')
            return '';
        else
            return a1.substring(0, a1.lastIndexOf("/") + 1);
}
arr = ['/web/assets/style.css', '/web/scripts/app.js',  'home/setting.conf'];
console.log(getCommonDirectoryPath(arr));