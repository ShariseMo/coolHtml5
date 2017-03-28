// function etaoAct(){
//自适应引入，元素单位用rem
	(function () {
        
        var b = document.documentElement,
        a = function () {
            var a = b.getBoundingClientRect().width;
            b.style.fontSize = (100/750) * (a >= 750 ? 750 : a) + "px"
        }, c = null;
        window.addEventListener("resize", function () {
            clearTimeout(c);
            c = setTimeout(a, 300)
        });
        a();
	})();

// }
// window.addEventListener("load", etaoAct);