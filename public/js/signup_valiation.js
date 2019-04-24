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
                        message: 'Email 不能為空'
                    },
                    emailAddress: {
                        message: '必須符合Email格式'
                    }
                }
            },
            phone: {
                validators: {
                    notEmpty: {
                        message: '連絡電話不得為空'
                    },
                    digits: {
                        message: '只能為數字'
                    },
                    stringLength: {
                        min: 10,
                        max: 10,
                        message: '連絡電話長度必須為10'
                    },
                    callback: {
                        message: '連絡電話必須為09開頭',
                        callback: function (value, validator, $field) {
                            var hed = value.substr(0, 2);
                            return hed === '09';
                        }
                    }
                }
            },
            username: {
                validators: {
                    notEmpty: {
                        message: '帳號不能為空'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: '帳號長度必須介於6到30之間'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '帳號只能包含字母，數字，點和下劃線'
                    },
                    remote: {
                        url: '/safedisk/checkUser',
                        type: 'POST',
                        message: '帳號已註冊'
                    },
                    different: {
                        field: 'password',
                        message: '帳號密碼不能相同'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密碼不能為空'
                    },
                    identical: {
                        field: 'verifypassword',
                        message: '密碼與密碼確認必須一樣'
                    },
                    different: {
                        field: 'username',
                        message: '帳號密碼不能相同'
                    }
                }
            },
            verifypassword: {
                validators: {
                    notEmpty: {
                        message: '密碼不能為空'
                    },
                    identical: {
                        field: 'password',
                        message: '密碼與密碼確認必須一樣'
                    },
                    different: {
                        field: 'username',
                        message: '帳號密碼不能相同'
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
                url:  "/safedisk/signup",
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
                    if (msg.info === "success") {
                        window.location = '/signin';

                    } else {
                        swal({
                            title: '註冊失敗',
                            text: msg.message,
                            type: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "OK!"
                        }).then(function () {
                            window.location = '/';
                        });
                    }
                },
                error: function (xhr) {
                    swal({
                        title: '註冊失敗',
                        text: xhr.responseJSON.message,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK!"
                    }).then(function () {
                        window.location = '/';
                    });
                }
            }); //close ajax

        });
});