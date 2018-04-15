$(document).ready(function () {
  $('#reg-form').bootstrapValidator({
    message: 'This value is not valid',

    fields: {
      username: {
        validators: {
          notEmpty: {
            message: 'The username is required'
          },
          stringLength: {
            min: 4,
            max: 30,
            message: 'The username must be more than 6 and less than 30 characters long'
          },
          regexp: {
            regexp: /^[a-zA-Z0-9_\.]+$/,
            message: 'The username can only consist of alphabetical, number, dot and underscore'
          },
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: 'The password is required'
          },
          identical: {
            field: 'verifypassword',
            message: 'The password and its confirm must be the same'
          },
          different: {
            field: 'username',
            message: 'The password and password cannot be the same as each other'
          }
        }
      }
    }
  }).on('success.form.bv', function (e) {
    // Prevent form submission
    e.preventDefault();
    // Get the form instance
    var $form = $(e.target);
    // Get the BootstrapValidator instance
    var bv = $form.data('bootstrapValidator');
    //alert("made it to submit handler block!");
    var user = document.getElementById("username").value;
    var pwd = document.getElementById("password").value;

    swal({
      title: "確定登入",
      type: "info",
      confirmButtonText: "Sign In",
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: function () {
        return new Promise(function () {
          $.ajax({
              type: "POST",
              url: "/signin",
              dataType: 'json',
              async: false,
              data: {
                User: user,
                Pwd: pwd
              }
            })
            .done(function (msg) {
              if (msg.info === "success") {
                swal({
                  title: msg.username + ' Login success',
                  type: "success",
                  showCancelButton: false,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "OK!"
                }).then(function () {
                  window.location = msg.url;
                });
              } else {
                swal({
                  title: 'Login error',
                  text: msg.message,
                  type: "error",
                  showCancelButton: false,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "OK!"
                }).then(function () {
                  window.location = '/signin';
                });
              }
            })
            .fail(function (xhr) {
              swal({
                title: 'Login error',
                text: xhr.responseJSON.message,
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK!"
              }).then(function () {
                window.location = '/signin';
              });
            }); //close ajax
        });
      },
      allowOutsideClick: false
    });
  });
});