function setCookie(name, value, day) {
	var date = new Date();
	date.setDate(date.getDate() + day);
	var willCookie = '';
	willCookie += name + '=' + encodeURIComponent(value) + ';';
	willCookie += 'Expires=' + date.toUTCString() + '';
	document.cookie = willCookie;
}

function getCookie(name) {
	var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return value ? value[2] : null;
}

var randstr = (function() {
	var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	return function(length, charset) {
		var len = length || 32;
		var charset = charset || chars;
		var arr = [];
		for (var i = 0; i < len; i++)
			arr[i] = charset.charAt(Math.floor(Math.random() * charset.length));
		return arr.join('');
	};
})();

if (getCookie('code')) $('#source').val(decodeURIComponent(getCookie('code')));
if (getCookie('result')) $('#result')[0].innerHTML = decodeURIComponent(getCookie('result'));