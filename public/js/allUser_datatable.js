//Table Read
$(document).ready(function() {
  var opt = {
    dom: '<"dt-buttons"Bfi>r<"text-center"t>lp',
    responsive: true,
    select: true,
    buttons: [
      {
        extend: 'copyHtml5',
        className: 'btn-info'
      },
      {
        extend: 'excelHtml5',
        className: 'btn-info'
      },
      {
        extend: 'csvHtml5',
        className: 'btn-info'
      },
      {
        extend: 'pdfHtml5',
        className: 'btn-info'
      },
      {
        extend: 'print',
        className: 'btn-info'
      }
    ],
    ajax: {
      url: '/safedisk/admin/get_allUser',
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
        data: 'email'
      },
      {
        data: 'userName'
      },
      {
        data: 'phone'
      }
    ]
  };
  $('#table_id').dataTable(opt);
});
