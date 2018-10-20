$(".buy-btn").click(function() {
  const usbTag = $(this).attr("name");

  const usbName = $(`h3[name=${usbTag}]`).text();
  const G = $(`input[name=radio-${usbTag}]:checked`).val() + "G";

  swal({
    text: `確定購買 ${usbName} ${G}?`,
    type: "info",
    showCancelButton: true,
    confirmButtonText: "購買",
    showLoaderOnConfirm: true,
    preConfirm: function() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve();
        }, 2000);
      });
    },
    allowOutsideClick: false
  }).then(function(result) {
    console.log(result);
    if (result.value === true) {
      swal({
        title: "購買完成",
        type: "success"
      });
    }
  });
});
