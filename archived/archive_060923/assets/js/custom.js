// const [red, green, blue] = [255, 255, 255]
// const section1 = document.querySelector('body')

// window.addEventListener('scroll', () => {
//   const y = 1 + (window.scrollY || window.pageYOffset) / 400
//   const [r, g, b] = [red/y, green/y, blue/y].map(Math.round)
//   section1.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
// })

// $(function() {
//     var rotation = 0.05, 
//         scrollLoc = $(document).scrollTop();
//     $(window).scroll(function() {
//         var newLoc = $(document).scrollTop();
//         var diff = scrollLoc - newLoc;
//         rotation += diff, scrollLoc = newLoc;
//         var rotationStr = "rotate(" + rotation + "deg)";
//         $(".gear").css({
//             "-webkit-transform": rotationStr,
//             "-moz-transform": rotationStr,
//             "transform": rotationStr
//         });
//     });
// })