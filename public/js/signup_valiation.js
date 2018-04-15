$(document).ready(function () {
  $('#reg-form').bootstrapValidator({
    message: 'This value is not valid',
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      email: {
        validators: {
          notEmpty: {
            message: 'The email is required'
          },
          emailAddress: {
            message: 'The input is not a valid email address'
          }
        }
      },
      phone: {
        validators: {
          notEmpty: {
            message: 'The phone is required'
          },
          digits: {
            message: 'The value can contain only digits'
          },
          stringLength: {
            min: 10,
            max: 10,
            message: 'The phone number must be 10 characters long'
          },
          callback: {
            message: 'The phone number wrong',
            callback: function (value, validator, $field){
              var hed = value.substr(0,2);
              return hed === '09';
            }
          }
        }
      },
      username: {
        validators: {
          notEmpty: {
            message: 'The username is required'
          },
          stringLength: {
            min: 6,
            max: 30,
            message: 'The username must be more than 6 and less than 30 characters long'
          },
          regexp: {
            regexp: /^[a-zA-Z0-9_\.]+$/,
            message: 'The username can only consist of alphabetical, number, dot and underscore'
          },
          remote: {
            url: '/checkUser',
            type: 'POST',
            message: 'The username is not available'
          },
          different: {
            field: 'password',
            message: 'The username and password cannot be the same as each other'
          }
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
      },
      verifypassword: {
        validators: {
          notEmpty: {
            message: 'The password is required'
          },
          identical: {
            field: 'password',
            message: 'The password and its confirm must be the same'
          },
          different: {
            field: 'username',
            message: 'The password and password cannot be the same as each other'
          }
        }
      }
    }
  }).off('success.form.fv')
  .on('success.form.bv', function (e) {
    // Prevent form submission
    e.preventDefault();
    // Get the form instance
    var $form = $(e.target);
    // Get the BootstrapValidator instance
    var bv = $form.data('bootstrapValidator');
    //alert("made it to submit handler block!");
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var user = document.getElementById("username").value;
    var pwd = document.getElementById("password").value;
    var vfypwd = document.getElementById("verifypassword").value;

    $.ajax({
      type: "POST",
      url: "/signup",
      dataType: 'json',
      async: false,
      data: {
        addEmail: email,
        addPhone: phone,
        addUser: user,
        addPwd: pwd,
        addvfypwd: vfypwd
      },
      success: function (msg) {
        if(msg.info === "success"){
          swal({
            title: 'Sign up success',
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "OK!"
          }).then(function () {
            window.location = '/signin';
          });
        } else {
          swal({
            title: 'Sign up error',
            text: msg.message,
            type: "error",
            showCancelButton: false, 
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "OK!"
          }).then(function() {
            window.location = '/';
          });
        }
      },
      error: function (xhr) {
        swal({
          title: 'Sign up error',
          text: xhr.responseJSON.message,
          type: "error",
          showCancelButton: false, 
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "OK!"
        }).then(function() {
          window.location = '/';
        });
      }
    }); //close ajax

  });
});