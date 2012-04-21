$(document).ready ->
  ajaxMain()

ajaxMain = ->
  $.ajax({
    url: '/main',
    timeout: 30000,
    data: { msg: 'test' },
    dataType: 'json',
    success: (result) ->
      $('#b2').text result
    failure: ->
      $('#b2').text 'request failed'
  )}

$('#c1').click = (e) ->
  e.preventDefault()
  ajaxMain()
