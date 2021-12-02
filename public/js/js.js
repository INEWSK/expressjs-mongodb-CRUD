// filter table
$("#search-input").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  console.log("Value: ", value);
  $("table tbody tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});
