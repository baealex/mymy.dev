var name = randstr(20);
function send_c_source() {
	setCookie('code', $('#source').val(), 7);
	$.ajax({
		url: '/run/c?name=' + name,
		type: 'post',
		data: { source: $('#source').val() }
	}).done(function(data) {
		$('#result')[0].innerHTML = data.replace(/\n/g, '<br />');
		setCookie('result', data.replace(/\n/g, '<br />'), 7);
	});
}
function send_cpp_source() {
	setCookie('code', $('#source').val(), 7);
	$.ajax({
		url: '/run/cpp?name=' + name,
		type: 'post',
		data: { source: $('#source').val() }
	}).done(function(data) {
		$('#result')[0].innerHTML = data.replace(/\n/g, '<br />');
		setCookie('result', data.replace(/\n/g, '<br />'), 7);
	});
}
function send_py_source() {
	setCookie('code', $('#source').val(), 7);
	$.ajax({
		url: '/run/py3?name=' + name,
		type: 'post',
		data: { source: $('#source').val() }
	}).done(function(data) {
		$('#result')[0].innerHTML = data.replace(/\n/g, '<br />');
		setCookie('result', data.replace(/\n/g, '<br />'), 7);
	});
}
function send_js_source() {
	setCookie('code', $('#source').val(), 7);
	$.ajax({
		url: '/run/js?name=' + name,
		type: 'post',
		data: { source: $('#source').val() }
	}).done(function(data) {
		$('#result')[0].innerHTML = data.replace(/\n/g, '<br />');
		setCookie('result', data.replace(/\n/g, '<br />'), 7);
	});
}