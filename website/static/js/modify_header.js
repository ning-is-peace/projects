(function(){
    window.onload = function(){
    let div = document.createElement("div");
    let txt = document.createTextNode("NING WANG'S WORK SAMPLES");
    div.appendChild(txt);
    div.setAttribute("style", "width:100%;text-align:center;");
    var h = document.getElementsByClassName("navigationWrapper");
    if (h && h[0]){
        h[0].parentNode.prepend(div);
    }
};
}());