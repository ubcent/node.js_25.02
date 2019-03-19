const http = require('http');	// модуль для создания http сервера
const request = require('request');	// модуль для отправки http запроса

const port = 8888;
const privateYandexApiKey = 'trnsl.1.1.20150313T142827Z.f78b998f078336a5.a3037dd3a2c0275c974a5522b083843b165b5732';

// создаем сервер, который входящие запросы на порту 8888

http.createServer((req, res) => {
	
	const method = req.method;	// получаем метод запроса
	
	if (method === 'GET'){
		
		const url = req.url;	
		
		const stringParams = url.split('?')[1];	
		console.log('-------')
		console.log('stringParams', stringParams)
		
		const params = {};
		if (typeof stringParams === 'string' && stringParams.length > 0){
			
			const stringSplitedParams = stringParams.split('&') 

			stringSplitedParams.forEach((string)=>{
				const keyValue = string.split('=');
				
				if (keyValue.length === 2) {
					const key = keyValue[0];
					const value = keyValue[1];
					params[key] = value
				}
			})
		}
	
		if (params.hasOwnProperty('word') && params.word.length > 0) {
			// отправляем запрос на перевод
			const word = params.word;

			request.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${privateYandexApiKey}&text=${word}&lang=en-ru&format=plain`, (err, translateRes, body) => {
				if (err) {
					// если что не корректно, то сразу отправляем ответ с ошибкой
					res.writeHead(400, {'Content-type': 'text/plain; charset=utf-8'});
					// отправляем назад текст ответа
    				res.write('неверный метод запроса');
    				// закрываем соединение
    				res.end();			
				}
				else {
					// если перевод есть, то отправялем обратно клиенту
					let yandexAnswer = JSON.parse(body);
					res.writeHead(400, {'Content-type': 'text/plain; charset=utf-8'});
					res.write(yandexAnswer.text[0]);
					res.end();
				}
				
				
			})
		}
		else {
			// если что не корректно, то сразу отправляем ответ с ошибкой
			res.writeHead(400, {'Content-type': 'text/plain; charset=utf-8'});
			// отправляем назад текст ответа
    		res.write('неверный метод запроса');
    		// закрываем соединение
    		res.end();	
		}
	}
	else {
		// если запрос пришел не методом GET, то шлем обратно ошибку
		// ставим код ответа 400 (Bad Request)
		// устанавливаем тип ответа 'text/plain'
		res.writeHead(400, {'Content-type': 'text/plain; charset=utf-8'});
		// отправляем назад текст ответа
    	res.write('неверный метод запроса');
    	// закрываем соединение
    	res.end();	
	}    
}).listen(port);

// как это работает ----> http://localhost:8888/?word=house (переведет house) переводит word=слово