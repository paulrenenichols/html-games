$(document).ready(function () {
  console.log(window.location.href);
  console.log(window.location.host);
  console.log(window.location.origin);

  $.ajax({
    url: window.location.origin + "/api/"
  })
  .done(function(data) {
    console.log(data);
  });

  $.ajax({
    url: window.location.origin + "/api/hello",
    data: {
      name: "bob"
    }
  })
  .done(function(data) {
    console.log(data.hello);
  });
});