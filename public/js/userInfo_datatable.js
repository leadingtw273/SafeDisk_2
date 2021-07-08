$(document).ready(function() {
  $.ajax({
    type: "post",
    url:  "/safedisk/user/get_userInfo",
    dataType: "json",
    success: function(data) {
      $("#name").text(data.userName);
      $("#email").text(data.email);
      $("#phone").text(data.phone);
    }
  });
});
