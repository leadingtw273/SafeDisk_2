//Table Read
$(document).ready(function() {
  //Edit row buttons
  $('.table_class').on('click', '.dt-edit', function(event) {
    var usbKey = $(this).attr('name');
    editUsbname(usbKey);
  });

  $('.table_class').on('click', '.webvct', function(event) {
    var userKey = $(this).attr('name');
    var userWeb = $(this).val();
    editWebvct(userKey, userWeb);
  });

  function editWebvct(userKey, userWeb) {
    $.ajax({
      type: 'post',
      url: '/safedisk/user/set_webvct',
      dataType: 'json',
      data: {
        key: userKey,
        web: userWeb
      },
      error: function(xhr) {
        alert('error: ' + xhr);
      }
    });
  }

  function editUsbname(usbKey) {
    swal({
      title: 'USB 名稱',
      input: 'text',
      inputPlaceholder: '輸入USB名稱',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      inputValidator: value => {
        return !value && 'You need to write something!';
      },
      preConfirm: function(value) {
        return new Promise(function() {
          $.ajax({
            type: 'post',
            url: '/safedisk/user/set_usbname',
            dataType: 'json',
            data: {
              key: usbKey,
              usbname: value
            }
          })
            .done(function(msg) {
              if (msg.info) {
                window.location = '/safedisk/user/user_usbList';
              } else {
                swal({
                  title: '註冊失敗',
                  type: 'error',
                  showCancelButton: false,
                  confirmButtonColor: '#DD6B55',
                  confirmButtonText: 'OK!'
                });
              }
            })
            .fail(function(xhr) {
              swal('error: ' + xhr);
            });
        });
      },
      allowOutsideClick: false
    }).then(function() {
      window.location = '/safedisk/user/user_usbList';
    });
  }

  var opt = {
    dom: '<"dt-buttons"Bf>r<"text-center"t>lp',
    responsive: true,
    ajax: {
      url: '/safedisk/user/get_usbList',
      type: 'post',
      data: function(data) {
        return data;
      }
    },
    columns: [
      {
        width: '40px',
        data: function(row, type, set, meta) {
          var c = meta.settings._iDisplayStart + meta.row + 1;
          return c;
        }
      },
      {
        //設定更改usb名稱按鈕
        targets: 1, //操作按鈕目標列
        data: null,
        render: function(data, type, row) {
          let usbname = data.usbName;
          let key = data.usbKey;
          let html =
            usbname +
            '<button type="button" name="' +
            key +
            '" class="btn btn-success btn-xs dt-edit"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>';
          return html;
        }
      },
      {
        data: 'linkID'
      },
      {
        data: 'usbKey'
      },
      {
        // 設定web驗證按鈕
        targets: 4, //操作按鈕目標列
        data: null,
        render: function(data, type, row) {
          let key = data.usbKey;
          let webvct = data.webVct;
          let webSet = '';
          if (webvct == 0) {
            webSet =
              '<label class="radio-inline"><input class="webvct" type="radio" name="' +
              key +
              '" value="1">True</label> <label class="radio-inline"><input class="webvct" type="radio" name="' +
              key +
              '" value="0" checked>False</label>';
          } else {
            webSet =
              '<label class="radio-inline"><input class="webvct" type="radio" name="' +
              key +
              '" value="1" checked>True</label> <label class="radio-inline"><input class="webvct" type="radio" name="' +
              key +
              '" value="0">False</label>';
          }

          return webSet;
        }
      }
    ],
    buttons: [
      {
        text: '<span class="glyphicon glyphicon-plus"></span> 註冊新USB',
        className: 'btn-info',
        action: function(e, dt, node, config) {
          swal({
            title: 'USB 金鑰',
            input: 'text',
            inputPlaceholder: '請輸入USB金鑰',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            inputValidator: value => {
              return !value && '請輸入金鑰!';
            },
            preConfirm: function(value) {
              return new Promise(function() {
                $.ajax({
                  type: 'post',
                  url: '/safedisk/user/set_key',
                  dataType: 'json',
                  data: {
                    key: value
                  }
                })
                  .done(function(msg) {
                    if (msg.info) {
                      editUsbname(value);
                    } else {
                      swal({
                        title: '註冊失敗',
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'OK!'
                      });
                    }
                  })
                  .fail(function(xhr) {
                    swal('error: ' + xhr);
                  });
              });
            }
          });
        }
      },
      {
        text: '<span class="glyphicon glyphicon-remove"></span> 刪除USB',
        className: 'btn-danger',
        action: function(e, dt, node, config) {
          swal({
            title: '您將刪除USB！',
            input: 'text',
            inputPlaceholder: '請輸入 USB 名稱',
            type: 'warning',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: '確定刪除！',
            allowOutsideClick: false,
            inputValidator: value => {
              return !value && 'You need to write something!';
            },
            preConfirm: function(value) {
              return new Promise(function() {
                $.ajax({
                  type: 'post',
                  url: '/safedisk/user/delete_usb',
                  dataType: 'json',
                  data: {
                    usbname: value
                  }
                })
                  .done(function(msg) {
                    if (msg.info) {
                      swal({
                        title: '刪除成功',
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'OK!'
                      }).then(function() {
                        window.location.reload();
                      });
                    } else {
                      swal({
                        title: '刪除失敗',
                        type: 'error',
                        text: msg.err,
                        showCancelButton: false,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'OK!'
                      });
                    }
                  })
                  .fail(function(xhr) {
                    swal('刪除失敗: ' + xhr);
                  });
              });
            }
          });
        }
      },
      {
        text: '<span class="glyphicon glyphicon-download"></span> 下載APP',
        className: 'btn-success',
        action: function(e, dt, node, config) {
          swal({
            title: 'APP 下載',
            text: '下載並開始使用你的加密隨身碟',
            imageUrl: '../images/frame.png'
          });
        }
      }
    ]
  };

  $('#table_id').dataTable(opt);
});
