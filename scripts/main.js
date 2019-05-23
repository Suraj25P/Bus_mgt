function myfunction() {
  var y = document.getElementById("stop");
  var x = y.value;
  $.ajax({
    url: "/products/" + x,
    content: "application/json",
    success: function(res) {
      var b = document.getElementById("busno");
      b.value = res[0].busno;

      var f = document.getElementById("feespaid");
      f.value = res[0].fees;
    }
  });
}
