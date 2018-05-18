$(document).ready(function() { 
  $('#addReview').submit(function(event) {
    $('.alert.alert-warning.alert-dismissible').hide();
    if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
      if ($('.alert.alert-warning.alert-dismissible').length) {
        $('.alert.alert-warning.alert-dismissible').show();
      } else {
        $(this).prepend('<div class="alert alert-warning alert-dismissible"><button type="button" data-dismiss="alert" class="close">&times;</button>        <strong>Warning !</strong>&nbsp;All fields required, please try again</div>');
      }
      event.preventDefault();
    }
  });
});


