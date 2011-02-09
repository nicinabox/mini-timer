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
  $('#elapsed span').html(formatDiff());
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

  out = sec+" sec";
  if (min > 0) {
    out = min%60+" min "+out;
  }
  if (hr > 0) {
   out = hr+" hr "+out;
  }
  
  return out;
}
round_me = function(amt, total) {
  return total - (total % amt);
}

$(document).ready(function() {
  // Set vars
  var debug = true;
  var startTime = localStorage['startTime'];
  var previousTime = localStorage['previousTime'];
  var active = is_active();
  var timer_id = localStorage['timer_id'];
  
  if (debug) console.log("Init Active: " + active);
  
  // If you reload the page
  if (active) {    
    $("#button a").attr('class', 'stop').text('Stop Time');
    $('#started span').html(formattedTime(startTime)).parent().show(); 
    $('#elapsed').show();
    
    // Start counting
    liveTime();
    
    // Use this to clear the timeout later
    localStorage['timer_id'] = setInterval(liveTime, 1000);
    
    if (debug) console.log("Reload: YES");
    if (debug) console.log("ID: " + localStorage['timer_id']);
  }
  
  // Set Previous time
  if (previousTime) {
    $('#previous span').html(previousTime).parent().show();
  }
   
  // If you click the button
  $('#button a').click(function() {
    var epoch = time();
    var human_time = formattedTime(epoch);
    
    if (!active) { // START
      // Do styling
      $("#button a").attr('class', 'stop').text('Stop Time');
      
      // Set current time
      localStorage['startTime'] = epoch;
      $('#started span').html(human_time).parent().fadeIn('fast');
      $('#total').hide();
      $('#rounded').hide();
      $('#previous').hide();
      
      $('#elapsed').fadeIn('fast');
      
      // Keep counting
      liveTime();
      localStorage['timer_id'] = setInterval(liveTime, 1000);
      active = true;
      
      if (debug) console.log("Active: " + active);
      if (debug) console.log("Started at: " + epoch);
      if (debug) console.log("ID: " + localStorage['timer_id']);
      
    } else { // STOP
      var diff = getDiff();
      var total = totalTime(diff);
      var timer_id = localStorage['previousTime'];
      
      // Do styling
      $("#button a").attr('class', 'start').text('Start Time');
      
      // Set total
      $('#total span').html(total).parent().fadeIn('fast');
      
      // Set rounding (in minutes)
      $('#rounded span').html(round_me(15, diff/60)).parent().fadeIn('fast');
      
      // Set previous time
      $('#previous span').html(previousTime).parent().fadeIn('fast');
      
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
