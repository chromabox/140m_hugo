! (function () {
    var list = document.body.getElementsByClassName("highlight");

    for(i=0; i <= list.length-1; i++){
        var code = list[i].firstElementChild.firstElementChild;
        var chr = list[i].firstElementChild;
        var codeName =  code ? code.className.split(":")[1] : null;

        if(codeName) {
            var div = document.createElement('div');
            var bbr = document.createElement('br');
            div.textContent = codeName;
            div.classList.add('code-name');
//            chr.parentNode.insertBefore(div, chr);
            code.parentNode.insertBefore(div, code);
            code.parentNode.insertBefore(bbr, code);

        }
    }
}());