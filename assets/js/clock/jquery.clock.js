(function(jQuery) {
  jQuery.fn.clock = function(options) {
    var defaults = {
      offset: '+2',  // Set the offset to +2 for Ljubljana (CEST)
      type: 'analog'
    };
    var _this = this;
    var opts = jQuery.extend(defaults, options);

    setInterval(function() {
      var time = jQuery.calcTime(opts.offset);
      var seconds = time.getSeconds();
      if (opts.type == 'analog') {
        var sdegree = seconds * 6;
        var srotate = "rotate(" + sdegree + "deg)";
        jQuery(_this).find(".sec").css({ "-moz-transform": srotate, "-webkit-transform": srotate });
      } else {
        jQuery(_this).find(".sec").html(seconds);
      }
    }, 1000);

    setInterval(function() {
      var time = jQuery.calcTime(opts.offset);
      var hours = time.getHours();
      var mins = time.getMinutes();
      if (opts.type == 'analog') {
        var hdegree = hours * 30 + (mins / 2);
        var hrotate = "rotate(" + hdegree + "deg)";
        jQuery(_this).find(".hour").css({ "-moz-transform": hrotate, "-webkit-transform": hrotate });
      } else {
        jQuery(_this).find(".hour").html(hours);
      }
      var meridiem = hours < 12 ? 'AM' : 'PM';
      jQuery(_this).find('.meridiem').html(meridiem);
    }, 1000);

    setInterval(function() {
      var time = jQuery.calcTime(opts.offset);
      var mins = time.getMinutes();
      if (opts.type == 'analog') {
        var mdegree = mins * 6;
        var mrotate = "rotate(" + mdegree + "deg)";
        jQuery(_this).find(".min").css({ "-moz-transform": mrotate, "-webkit-transform": mrotate });
      } else {
        jQuery(_this).find(".min").html(mins);
      }
    }, 1000);
  };
})(jQuery);

jQuery.calcTime = function() {
  var d = new Date();
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  
  // Check if Daylight Saving Time (DST) is in effect for Ljubljana (CEST or CET)
  var isDST = (d.getMonth() > 2 && d.getMonth() < 10) || (d.getMonth() === 2 && d.getDate() >= (31 - (d.getDay() + 1) % 7)) || (d.getMonth() === 9 && d.getDate() < (31 - (d.getDay() + 1) % 7));
  
  // Adjust the offset for daylight saving time
  var offset = isDST ? 2 : 1; // Use UTC+2 during DST (CEST) or UTC+1 during standard time (CET)

  // Apply the offset
  var nd = new Date(utc + (3600000 * offset));
  return nd;
};
