//Table Read
$(document).ready(function() {
  //Edit row buttons
  $(".table_class").on("click", ".dt-edit", function(event) {
    var usbKey = $(this).attr("name");
    editUsbSyn(usbKey);
  });

  function editUsbSyn(usbKey) {
    $.ajax({
      type: "POST",
      url:  "/safedisk/admin/edit_USB",
      dataType: "json",
      async: false,
      data: {
        key: usbKey
      },
      success: function(msg) {
        if (msg.info === "success") {
          $("#key").text(msg.data.usbKey);

          $("#a1").val(msg.data.Syndata[0]);
          $("#a2").val(msg.data.Syndata[1]);
          $("#a3").val(msg.data.Syndata[2]);
        } else {
          swal({
            title: "取得資料出錯",
            text: msg.message,
            type: "error",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "OK!"
          }).then(function() {
            window.location = "/safedisk/admin/manager_allUsb";
          });
        }
      },
      error: function(xhr) {
        swal({
          title: "取得資料出錯",
          text: xhr.responseJSON.message,
          type: "error",
          showCancelButton: false,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "OK!"
        }).then(function() {
          window.location = "/safedisk/admin/manager_allUsb";
        });
      }
    }); //close ajax
  }

  var opt = {
    dom: '<"dt-buttons"Bf>r<"text-center"t>lp',
    responsive: true,
    select: true,
    buttons: [
      {
        text: "NEW",
        className: "btn-success data-newOrder"
      },
      {
        extend: "colvis",
        className: "btn-info"
      },
      {
        extend: "copyHtml5",
        className: "btn-info"
      },
      {
        extend: "excelHtml5",
        className: "btn-info"
      },
      {
        extend: "csvHtml5",
        className: "btn-info"
      },
      {
        extend: "pdfHtml5",
        className: "btn-info"
      },
      {
        extend: "print",
        className: "btn-info"
      }
    ],
    ajax: {
      url:  "/safedisk/admin/get_allUsb",
      type: "post",
      data: function(data) {
        return data;
      }
    },
    columns: [
      {
        width: "40px",
        data: function(row, type, set, meta) {
          var c = meta.settings._iDisplayStart + meta.row + 1;
          return c;
        }
      },
      {
        data: "linkID"
      },
      {
        data: "userName"
      },
      {
        data: "usbKey"
      },
      {
        data: "usbName"
      },
      {
        data: "webVct"
      },
      {
        //設定更改usb 調變參數按鈕
        targets: 6, //操作按鈕目標列
        data: null,
        render: function(data, type, row) {
          let synValue = data.synValue;
          let key = data.usbKey;
          let html =
            synValue +
            ' <button type="button" name="' +
            key +
            '" class="btn btn-success btn-xs dt-edit" data-toggle="modal" data-target="#myEditModal"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>';
          return html;
        }
      }
    ]
  };

  $("#table_id").dataTable(opt);

  // 按鈕設定
  $(".data-newOrder")
    .attr("data-toggle", "modal")
    .attr("data-target", "#myNewModal");

  $("#newUsb-from")
    .bootstrapValidator({
      message: "This value is not valid",
      feedbackIcons: {
        valid: "glyphicon glyphicon-ok",
        invalid: "glyphicon glyphicon-remove",
        validating: "glyphicon glyphicon-refresh"
      },
      fields: {
        count: {
          validators: {
            notEmpty: {
              message: "The count is required"
            },
            digits: {
              message: "The value can contain only digits"
            }
          }
        }
      }
    })
    .off("success.form.fv")
    .on("success.form.bv", function(e) {
      // Prevent form submission
      e.preventDefault();
      // Get the form instance
      var $form = $(e.target);
      // Get the BootstrapValidator instance
      var bv = $form.data("bootstrapValidator");
      //alert("made it to submit handler block!");
      var count = document.getElementById("count").value;

      $.ajax({
        type: "POST",
        url:  "/safedisk/admin/new_USB",
        dataType: "json",
        async: false,
        data: {
          MAX: count
        },
        success: function(msg) {
          if (msg.info === "success") {
            swal({
              title: "資料成功新增",
              type: "success",
              showCancelButton: false,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "OK!"
            }).then(function() {
              window.location = "/safedisk/admin/manager_allUsb";
            });
          } else {
            swal({
              title: "新增資料出錯",
              text: msg.message,
              type: "error",
              showCancelButton: false,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "OK!"
            }).then(function() {
              window.location = "/safedisk/admin/manager_allUsb";
            });
          }
        },
        error: function(xhr) {
          swal({
            title: "新增資料出錯",
            text: xhr.responseJSON.message,
            type: "error",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "OK!"
          }).then(function() {
            window.location = "/safedisk/admin/manager_allUsb";
          });
        }
      }); //close ajax
    });

  $("#showUsb-from")
    .bootstrapValidator({
      message: "This value is not valid",
      feedbackIcons: {
        valid: "glyphicon glyphicon-ok",
        invalid: "glyphicon glyphicon-remove",
        validating: "glyphicon glyphicon-refresh"
      },
      fields: {
        a1: {
          validators: {
            notEmpty: {
              message: "The a1 is required"
            },
            numeric: {
              message: "The value is not a number",
              // The default separators
              thousandsSeparator: "",
              decimalSeparator: "."
            }
          }
        },
        a2: {
          validators: {
            notEmpty: {
              message: "The a2 is required"
            },
            numeric: {
              message: "The value is not a number",
              // The default separators
              thousandsSeparator: "",
              decimalSeparator: "."
            }
          }
        },
        a3: {
          validators: {
            notEmpty: {
              message: "The a3 is required"
            },
            numeric: {
              message: "The value is not a number",
              // The default separators
              thousandsSeparator: "",
              decimalSeparator: "."
            }
          }
        }
      }
    })
    .off("success.form.fv")
    .on("success.form.bv", function(e) {
      // Prevent form submission
      e.preventDefault();
      // Get the form instance
      var $form = $(e.target);
      // Get the BootstrapValidator instance
      var bv = $form.data("bootstrapValidator");
      //alert("made it to submit handler block!");
      var a1 = document.getElementById("a1").value;
      var a2 = document.getElementById("a2").value;
      var a3 = document.getElementById("a3").value;

      var key = document.getElementById("key").textContent;

      $.ajax({
        type: "POST",
        url:  "/safedisk/admin/edit_USB_Syn",
        dataType: "json",
        async: false,
        data: {
          key: key,
          a1: a1,
          a2: a2,
          a3: a3
        },
        success: function(msg) {
          if (msg.info === "success") {
            swal({
              title: "資料成功更新",
              type: "success",
              showCancelButton: false,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "OK!"
            }).then(function() {
              window.location = "/safedisk/admin/manager_allUsb";
            });
          } else {
            swal({
              title: "更新資料出錯",
              text: msg.message,
              type: "error",
              showCancelButton: false,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "OK!"
            }).then(function() {
              window.location = "/safedisk/admin/manager_allUsb";
            });
          }
        },
        error: function(xhr) {
          swal({
            title: "更新資料出錯",
            text: xhr.responseJSON.message,
            type: "error",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "OK!"
          }).then(function() {
            window.location = "/safedisk/admin/manager_allUsb";
          });
        }
      }); //close ajax
    });
});
