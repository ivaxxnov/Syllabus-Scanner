/*
Seperate Function for building query GPT function.
*/



/*
build prompt to send to chatgdp
-- parameters: pdf in string format
-- return: prompt ready to send
*/
function buildPrompt(pdf) {
}


/*
send prompt to chatgdp and return response
-- parameters: prompt
-- return: chatgdp response
*/

function queryGPT(prompt) {
	const apiKey = 'ENTER API KEY HERE';
	const endpoint = 'https://api.openai.com/v1/completions';

	const data = {
		model: 'babbage-002',
		prompt: prompt,
		temperature: .5, // 0-2. 0 is deterministic. 2 is more creative
		max_tokens: 2048, // max 2048
		top_p: 1, // 0-1. 0 is more diverse.
		frequency_penalty: 0, // 0-2. 2 is less repetitive.
		presence_penalty: 0 // 0-2.
	};
	console.log("start fetch")
	fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify(data)
	})
		.then(response => response.json())
		.then(result => {
			console.log(result);
			console.log("done res")
		})
		.catch(error => {
			console.error('Error:', error);
		});
}

