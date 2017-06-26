$(document).ready(function(){
  setTimeout(function(){
    function toggleMobileMenu(){
      $('.hamburger').toggleClass('is-active');
      $('.hamburger').toggleClass('hamburger-inverse-color');
      $('.nav-top').toggleClass('nav-top-expanded');
    }
    $('.hamburger').click(function(){
        toggleMobileMenu();
    });
    $('.logout').click(function(){
      toggleMobileMenu();
    });

    $('.content-section').click(function(){
      if ($(this).hasClass('content-section-fullsize')) {
        setTimeout(function(){
          $('.content-section').removeClass('content-section-top');
        },300);
      }else{
        $(this).addClass('content-section-top');
      }
      $(this).toggleClass('content-section-fullsize');
      $('.content-section-overlay').toggleClass('fadeout');
    });
  },500);
});







































//
