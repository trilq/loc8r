$(document).ready(function() { 

  $('.alert.alert-warning.alert-dismissible').hide();
  
  $('#addReview').submit(function(event) {
    
    if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
      if ($('.alert.alert-warning.alert-dismissible').length) {
        $('.alert.alert-warning.alert-dismissible').show();
      } else {
        $(this).prepend('<div class="alert alert-warning alert-dismissible"><button type="button" data-dismiss="alert" class="close" style="padding: 8px 16px">&times;</button><strong>Warning !</strong>&nbsp;All fields required, please try again</div>');
      }
      event.preventDefault();
    }
  });
    
  $('.alert.alert-warning.alert-dismissible').hide();
    
  $('#findLocations').submit(function(event) {
    
    if (!$('input#distance').val() || isNaN($('input#distance').val())) {
      if ($('.alert.alert-warning.alert-dismissible').length) {
        $('.alert.alert-warning.alert-dismissible').show();
      } else {
        $(this).prepend('<div class="alert alert-warning alert-dismissible"><button type="button" data-dismiss="alert" class="close" style="padding: 8px 16px">&times;</button><strong>Oops !</strong>&nbsp;Distance should be a number of meters, please try again</div>');
      }
      event.preventDefault();
    }    
  }); 
});


