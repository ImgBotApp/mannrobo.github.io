// Attach all the listeners
window.addEventListener("load", function() {
    function $(query) { return document.querySelector(query) }; // Like jQuery, but better

    $("header a.hamburger").addEventListener("click", function(e) {
        e.preventDefault();
        $("header a.hamburger").classList.toggle("active");
        $("header ul.links").classList.toggle("active");
    });

    var links = document.querySelectorAll("header ul.links li a");
    for(var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function(e) {
            e.preventDefault();
            console.log(e.target.dataset.scrollto);
            scrollToElement($(e.target.dataset.scrollto), 400);
            for (var x = 0; x < links.length; x++) links[x].classList.remove("active");
            e.target.classList.add("active");
        });
    }

    if(window.carosel) {
        console.log("Carosel Activated");
        var i = 0;
        var top = $("header .bg .top");
        var bottom = $("header .bg .bottom");
        setInterval(function() {
            top.classList.toggle("step");
            bottom.classList.toggle("step");

            if(i++ % 2) {
                top.src = carosel[i % carosel.length]
            } else {
                bottom.src = carosel[i % carosel.length]
            }
        }, 10 * 1000)
    }

});

/**
 * Linearly Scrolls to a specified element on the page
 * @param {Element} element 
 * @param {Number} duration The duration of the scroll, in ms
 * @param {Function} callback
 */
function scrollToElement(element, duration, callback) {
    if(!element) return;
    var startingY = window.pageYOffset;
    var diff = getYOffset(element) - startingY;
    var start;

    requestAnimationFrame(function go(timestamp) {
        if(!start) start = timestamp;
        var delta = timestamp - start, // Elapsed time
            percent = Math.min(delta / duration, 1); // [0, 1]

        scrollTo(0, startingY + diff * percent);
        if (delta < duration) {
            window.requestAnimationFrame(go);
        } else {
            callback && callback();
        }
    });
}

/**
 * Returns the y offset of the specified element
 * @param {Element} element 
 */
function getYOffset(element) {
    var rec = element.getBoundingClientRect();
    return rec.top + window.scrollY;
}