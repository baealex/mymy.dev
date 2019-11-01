var name = randstr(10);
function send_c_source() {
	setCookie('code', $('#source').val(), 7);
	$.ajax({
		url: '/c?name=' + name,
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
		url: '/cpp?name=' + name,
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
		url: '/py?name=' + name,
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
		url: '/js?name=' + name,
		type: 'post',
		data: { source: $('#source').val() }
	}).done(function(data) {
		$('#result')[0].innerHTML = data.replace(/\n/g, '<br />');
		setCookie('result', data.replace(/\n/g, '<br />'), 7);
	});
}