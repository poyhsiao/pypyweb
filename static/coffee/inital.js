// Generated by CoffeeScript 1.6.2
(function() {
  var head, script;

  if ('undefined' === $) {
    head = document.getElementsByTagName('head')[0];
    script = document.createElement('script');
    script.src = '/script/jquery.js';
    script.type = 'text/javascript';
    script.defer = 'defer';
    script.onload(function(e) {
      return alert(123);
    });
    head.appendChild(script);
  }

}).call(this);
