//NEWS STICKER
head.js("assets/js/newsticker/jquery.newsTicker.js", function() {

    var nt_title = $('#nt-title').newsTicker({
        row_height: 18,
        max_rows: 1,
        duration: 5000,
        pauseOnHover: 0
    });


});

//------------------------------------------------------------- 

////Acordion and Sliding menu

head.js("assets/js/custom/scriptbreaker-multiple-accordion-1.js", function() {

    $(".topnav").accordionze({
        accordionze: true,
        speed: 500,
        closedSign: '<img src="assets/img/plus.png">',
        openedSign: '<img src="assets/img/minus.png">'
    });

});

//-------------------------------------------------------------

//SEARCH MENU
head.js("assets/js/search/jquery.quicksearch.js", function() {

    $('input.id_search').quicksearch('#menu-showhide li, .menu-left-nest li');
   
   

});
//-------------------------------------------------------------

//NICE SCROLL

head.js("assets/js/nano/jquery.nanoscroller.js", function() {

    $(".nano").nanoScroller({
        //stop: true 
        scroll: 'top',
        scrollTop: 0,
        sliderMinHeight: 40,
        preventPageScrolling: true
        //alwaysVisible: false

    });

});
//------------------------------------------------------------- 
//PAGE LOADER
// Define paceOptions globally before loading pace.js
var paceOptions = {
    ajax: false,
    document: false,
    eventLag: false,
    elements: {
        selectors: ['.my-page']
    }
};

// Now load pace.js
head.js("assets/js/pace/pace.js");

//------------------------------------------------------------- 

//DIGITAL CLOCK
head.js("assets/js/clock/jquery.clock.js", function() {

    //clock
    $('#digital-clock').clock({
        offset: '+5',
        type: 'digital'
    });


});