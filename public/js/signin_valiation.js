$(document).ready(function() {
  $("#reg-form")
    .bootstrapValidator({
      message: "This value is not valid",

      fields: {
        username: {
          validators: {
            notEmpty: {
              message: "帳號不能為空"
            },
            stringLength: {
              min: 4,
              max: 30,
              message: "帳號自述需介於6到30之間"
            },
            regexp: {
              regexp: /^[a-zA-Z0-9_\.]+$/,
              message: "帳號只能包含字母，數字，點和下劃線"
            }
          }
        },
        password: {
          validators: {
            notEmpty: {
              message: "密碼不能為空"
            },
            identical: {
              field: "verifypassword",
              message: "密碼及其確認密碼必須相同"
            },
            different: {
              field: "username",
              message: "密碼和帳號不能相同"
            }
          }
        }
      }
    })
    .on("success.form.bv", function(e) {
      // Prevent form submission
      e.preventDefault();
      // Get the form instance
      var $form = $(e.target);
      // Get the BootstrapValidator instance
      var bv = $form.data("bootstrapValidator");
      //alert("made it to submit handler block!");
      var user = document.getElementById("username").value;
      var pwd = document.getElementById("password").value;

      swal({
        title: "確定登入",
        type: "info",
        confirmButtonText: "Sign In",
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: function() {
          return new Promise(function() {
            $.ajax({
              type: "POST",
              url: "/signin",
              dataType: "json",
              async: false,
              data: {
                User: user,
                Pwd: pwd
              }
            })
              .done(function(msg) {
                if (msg.info === "success") {
                  window.location = msg.url;
                } else {
                  swal({
                    title: "登入失敗",
                    text: msg.message,
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK!"
                  }).then(function() {
                    window.location = "/signin";
                  });
                }
              })
              .fail(function(xhr) {
                swal({
                  title: "登入失敗",
                  text: xhr.responseJSON.message,
                  type: "error",
                  showCancelButton: false,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "OK!"
                }).then(function() {
                  window.location = "/signin";
                });
              }); //close ajax
          });
        },
        allowOutsideClick: false
      });
    });
});
