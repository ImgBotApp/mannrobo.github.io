
// Carosel Images
var images = [
    "https://images.unsplash.com/photo-1496482475496-a91f31e0386c?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=",
    "https://images.unsplash.com/photo-1498477386155-805b90bf61f7?dpr=1&auto=format&fit=crop&w=1500&h=913&q=80&cs=tinysrgb&crop=",
    "https://images.unsplash.com/photo-1499482624510-89fb8b6d0ded?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=",
    "https://images.unsplash.com/photo-1496251713551-8cef3b476b0c?dpr=1&auto=format&fit=crop&w=1500&h=998&q=80&cs=tinysrgb&crop="
];
// Preload all these images
images.forEach(function(src) {
    var img = new Image();
    img.src = src;
});

function $(query) { return document.querySelector(query) }; // Like jQuery, but better ;)

window.load = (function () {
    var loadFunctions = [];
    function onload(fn) {
        if (document.readyState == "complete") {
            fn();
        } else {
            loadFunctions.push(fn);
        }
    }
    window.addEventListener("load", function () {
        for (var i = 0; i < loadFunctions.length; i++) {
            loadFunctions[i]();
        }
    })
    return onload;
})();

/**
 * Gets the closest element to the top of the viewport
 * @param {Element[]|ElementList} elements The elements to track
 */
function closestToTop(elements) {
    return elements.sort((a, b) => Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top))[0];
}

function activateSection() {
    var navPoints = Array.from(document.querySelectorAll("header ul.links li a[data-go]"));
    var id = closestToTop(navPoints.map(v => $(v.dataset.go))).id;
    for (var i = 0; i < navPoints.length; i++) {
        navPoints[i].classList.remove("active");
    }
    console.log(id);
    $("header ul.links li a[data-go='#"+id+"']").classList.add("active");
    
}

// Attach all the listeners
load(function() {

    $("header a.hamburger").addEventListener("click", function(e) {
        e.preventDefault();
        $("header a.hamburger").classList.toggle("active");
        $("header ul.links").classList.toggle("active");
        $("header nav").classList.toggle("active");
    });

    var links = document.querySelectorAll("header ul.links li a");
    var menu = $("header nav ul.links");
    var hamburger = $("header nav a.hamburger")
    for(var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function(e) {
            if (e.target.dataset.go) {
                e.preventDefault();
                for (var x = 0; x < links.length; x++) links[x].classList.remove("active");
                e.target.classList.add("active");
                menu.classList.remove("active");
                hamburger.classList.remove("active");
                scrollToElement($(e.target.dataset.go), 400);
            }
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

    var nav = $("header nav");
    function goScroll() {
        var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        if (scrollTop >= 300) {
            nav.classList.add("fixed");
        } else {
            nav.classList.remove("fixed");
        }
        
        activateSection();
        

    }
    window.addEventListener("scroll", goScroll, false);
    window.addEventListener("gesturechange", goScroll, false);
    window.addEventListener("touchmove", goScroll, false);
    window.addEventListener("touchstart", goScroll, false);
    window.addEventListener("touchend", goScroll, false);
});



function scrollToElement(element, duration, callback) {
    if(!element) return;
    var startingY = window.pageYOffset;
    var diff = getYOffset(element) - startingY - 50;
    var start;

    requestAnimationFrame(function go(timestamp) {
        if(!start) start = timestamp;
        var delta = timestamp - start, // Elapsed time
            percent = Math.min(delta / duration, 1); // [0, 1]

        scrollTo(0, startingY + diff * percent);
        if (delta < duration) {
            window.requestAnimationFrame(go);
        } else {
            if (callback && typeof (callback) === "function") {
                // the animation is done so lets callback
                callback();
            }
        }
    });
}

/**
 * Returns the y offset of the specified element
 * @param {Element} element 
 */
function getYOffset(element) {
    if(!element) return NaN;
    var rec = element.getBoundingClientRect();
    return rec.top + window.scrollY;
}
// Touch Detection
window.addEventListener("touchstart", function onFirstTouch() {
    document.body.classList.add("user-is-touching");  
    window.removeEventListener("touchstart", onFirstTouch, false);
  }, false);