const randstr = (function() {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	return function(length, charset) {
		var len = length || 32;
		var charset = charset || chars;
		var arr = [];
		for (var i = 0; i < len; i++)
			arr[i] = charset.charAt(Math.floor(Math.random() * charset.length));
		return arr.join('');
	};
})();

const IDE = (function() {
	const intt = randstr(20);
	let code = undefined;
	let result = undefined;
	try {
		code = localStorage.getItem('code');
		result = JSON.parse(localStorage.getItem('result'));
	} catch {
		code = undefined;
		result = undefined;
		localStorage.clear();
	}

	console.log(result);

	const makeResult = function(element) {
		return element.result.replace(/\n/g, '<br />') + '<br />Run Time : '+ element.time;
	}

	const saveState = function(code, result) {
		localStorage.setItem('code', code);
		localStorage.setItem('result', JSON.stringify(result));
	}

	const run = function(type) {
		$.ajax({
			url: '/run/'+ type +'?intt=' + intt,
			type: 'POST',
			data: {
				source: $('#source').val()
			}
		}).done(function(data) {
			$('#result')[0].innerHTML = makeResult(data);
			saveState($('#source').val(), data);
		});
	}

	if(code)
		$('#source').val(code);
	if(result)
		$('#result')[0].innerHTML = makeResult(result);

	return {
		c: function() {
			run('c');
		},
		cpp: function() {
			run('cpp');
		},
		py3: function() {
			run('py3');
		},
		js: function() {
			run('js');
		}
	}
})();