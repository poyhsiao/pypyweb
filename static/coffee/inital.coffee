if 'undefined' == $
  head = document.getElementsByTagName('head')[0]
  script = document.createElement 'script'
  script.src = '/script/jquery.js'
  script.type = 'text/javascript'
  script.defer = 'defer'
  script.onload (e) -> alert 123
  head.appendChild script

