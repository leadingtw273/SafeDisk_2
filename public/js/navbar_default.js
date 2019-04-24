$(document).ready(function() {
  $.ajax({
    type: "post",
    url:  "/safedisk/checkSession",
    dataType: "json",
    success: function(res) {
      switch (res.user) {
        case "root":
          $("#admin").removeClass("hidden");
          break;
        case undefined:
          $("#no-login").removeClass("hidden");
          break;
        default:
          $("#user_span").after(" " + res.user);
          $("#yes-login").removeClass("hidden");
          break;
      }
    }
  });

  $(".sign-out").click(function() {
    swal({
      title: "確定登出?",
      type: "info",
      confirmButtonText: "登出",
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: function() {
        return new Promise(function() {
          $.ajax({
            type: "post",
            url:  "/safedisk/signout",
            dataType: "json"
          })
            .done(function(msg) {
              if (msg.info === "success") {
                window.location = "/";
              } else {
                swal("error: " + msg);
              }
            })
            .fail(function(xhr) {
              swal("error: " + xhr);
            });
        });
      },
      allowOutsideClick: false
    });
  });

  $(".shop-btn").click(function() {
    window.location.pathname = "/safedisk/shop";
  });
});
