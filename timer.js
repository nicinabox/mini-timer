function formattedTime(epoch) {
  var date = new Date(epoch*1000);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  // Formatting
  if (minutes < 10) minutes = "0"+minutes;
  if(hours > 11){
    var time = (hours-12) + ':' + minutes + "pm";
  } else {
    var time = hours + ':' + minutes + "am";
  }
  return time;
}
function is_active() {
  var active = localStorage.getItem("startTime");
  if (active != "" && active != null) { // iepoch running
    return true;
  } else {
    return false;
  }
}
function time() {
  return Math.round(new Date().getTime() / 1000);
}
function liveTime() {
  $('#timer .elapsed span').html(formatDiff());
}
function totalTime(diff) {
  return (diff/60/60).toFixed(2);
}
function getDiff() {
  var now = time();
  var started = localStorage['startTime'];
  return now-started; 
}
function formatDiff() {
  var diff = getDiff();
  
  sec = diff % 60; 
  min = Math.floor(diff/60); 
  hr = Math.floor(diff/60/60); 

  out = sec+"&nbsp;sec";
  if (min > 0) {
    out = min%60+"&nbsp;min&nbsp;"+out;
  }
  if (hr > 0) {
   out = hr+"&nbsp;hr&nbsp;"+out;
  }
  
  return out;
}
round_me = function(amt, total) {
  return total - (total % amt);
}

$(document).ready(function() {
  // Set vars
  var debug = false;
  var startTime = localStorage['startTime'];
  var previousTime = localStorage['previousTime'];
  var active = is_active();
  var timer_id = localStorage['timer_id'];
  var $info = $('#timer .started, #timer .total, #timer .rounded, #timer .previous');
  
  if (debug) console.log("Init Active: " + active);
  
  // If you reload the page
  if (active) {    
    $("#timer .button a").attr('class', 'stop').text('Stop Time');
    $('#timer .started span').html(formattedTime(startTime)); 
    
    $info.stop(true, true).animate({width: 'easeOutExpo'}, 500);
        
    // Start counting
    liveTime();
    
    // Use this to clear the timeout later
    localStorage['timer_id'] = setInterval(liveTime, 1000);
    $('#timer .elapsed').stop(true, true).animate({width: ['toggle', 'easeOutExpo']}, 500);
    
    if (debug) console.log("Reload: YES");
    if (debug) console.log("ID: " + localStorage['timer_id']);
    
  } else {
    // show previous time
    $('#timer .previous span').html(previousTime);
    $('#timer .previous').animate({width: ['toggle', 'easeOutExpo']}, 500);
  }
  
  //Show some info on hover
  $('#timer .elapsed').hover(function() {
    if (active) {
      $('#timer .started').stop(true, true).animate({
        width: ['toggle', 'easeOutExpo']
        }, 500); 
    }
  }, function() {
    if (active) {
      $('#timer .started').stop(true, true).animate({
        width: ['toggle', 'easeOutExpo']
        }, 500);
    }
  });
  
  // If you click the button
  $('#timer .button a').click(function() {
    var epoch = time();
    var human_time = formattedTime(epoch);
    
    if (!active) { // START
      // Do styling
      $("#timer .button a").attr('class', 'stop').text('Stop Time');
      
      // Set current time
      localStorage['startTime'] = epoch;
      $('#timer .started span').html(human_time);

      // Hide extras
      if ($('#timer .previous').is(':visible') && $info.is(':hidden')) {
        $('#timer .previous').hide(); 
      }
      if ($info.is(':visible')) {
        $info.stop(true, true).animate({width: ['toggle', 'easeOutExpo']}, 500);
      }
        
      // Keep counting
      liveTime();
      localStorage['timer_id'] = setInterval(liveTime, 1000);
      
      if ($('#timer .elapsed').is(':hidden')) {
        $('#timer .elapsed').stop(true, true).animate({width: ['toggle', 'easeOutExpo']}, 500);
      }
      
      active = true;
      
      if (debug) console.log("Active: " + active);
      if (debug) console.log("Started at: " + epoch);
      if (debug) console.log("ID: " + localStorage['timer_id']);
      
    } else { // STOP
      var diff = getDiff();
      var total = totalTime(diff);
      var timer_id = localStorage['previousTime'];
      
      // Do styling
      $("#timer .button a").attr('class', 'start').text('Start Time');
      $('#timer .elapsed').animate({width: 'easeOutExpo'}, 500);
      
      $('#timer .total span').html(total);
      $('#timer .rounded span').html(round_me(15, diff/60));
      
      // Set previous time
      $('#timer .previous span').html(previousTime);
      $('#timer .previous').hide();
      
      $info.stop(true, true).animate({width: ['toggle', 'easeOutExpo']}, 500);
      
      if (total != "0.00") {
        localStorage['previousTime'] = total;
      }
      
      // Clean up
      clearTimeout(localStorage['timer_id']);
      localStorage.removeItem('startTime');
      localStorage.removeItem('timer_id');
      active = false;
      
      if (debug) console.log("Active: " + active);
      if (debug) console.log("Total: " + total);
      if (debug) console.log("Previous: " + previousTime);
      if (debug) console.log("ID cleared: " + timer_id);
      
    }
    return false;
  });
});
