$(document).ready(function(){
 $('.header-contacts__button').on('click', function(){
    $('.overlay').show();
 });
 $('.popup-close').on('click', function(){
     $('.overlay').hide();
 })
});