$(function() {

	if ( $('.owl-2').length > 0 ) {
        $('.owl-2').owlCarousel({
            center: false,
            items: 1,
            loop: true,
            stagePadding: 0,
            margin: 20,
            smartSpeed: 600,
            autoplay: true,
            nav: true,
            dots: true,
            pauseOnHover: false,
            responsive:{
                600:{
                    margin: 20,
                    nav: true,
                  items: 2
                },
                1000:{
                    margin: 20,
                    stagePadding: 0,
                    nav: true,
                  items: 3
                }
            }
        });            
    }

})

// See more Button
  document.getElementById('see-more-btn').addEventListener('click', function () {
  // Ambil semua elemen dengan kelas 'see-more-item'
  const hiddenItems = document.querySelectorAll('.see-more-item');
  hiddenItems.forEach(item => {
    item.classList.remove('d-none'); // Tampilkan elemen
  });
  this.style.display = 'none'; // Sembunyikan tombol setelah diklik
});