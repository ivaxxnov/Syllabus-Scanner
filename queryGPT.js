/*
Seperate Function for building query GPT function.
*/

/**
 * takes a syllabus and returns a JSON string with the wanted data, in the established format
 * @param syllabus the syllabus
 * @returns {Promise<string | string>} the JSON as a string
 */
function parse_syllabus(syllabus) {
	return queryGPT(buildPrompt(syllabus)).then(response_1 => {
		return getTextFromGPT(response_1);
	}).catch(error => {
		console.error('Error:', error);
		return ""
	});
}

// builds the prompt given the syllabus
function buildPrompt(syllabus) {
	return `I need you to create a JSON object containing specific information about a school course from the given syllabus. I want the JSON that you give me to match the exact formatting of the JSON object below. Do not add any fields.
		If there are weekly assignments, include a different object for each week. If there is a weekly assignment due on Tuesdays for example, you can simply say "Tuesday Week 1" for the first assignment, "Tuesday Week 2" for the second assignment, up until the semester is over.
		The time attribute is for the time that an assignment is due, or the time when an assesment starts (like a quiz, test, or exam)

"""
{
  "subject": "Computer Science",
  "schedule": [
    {
      "title": "Algorithm Design Assignment",
      "due_date": "2023-12-25",
      "time": "14:00"
    },
    {
      "title": "Programming Principles Quiz",
      "due_date": "2024-01-05",
      "time": "10:30"
    },
    {
      "title": "Data Structures Test",
      "due_date": "2024-01-15",
      "time": "09:00"
    },
    {
      "title": "Software Development Project Presentation",
      "due_date": "2024-01-10",
      "time": "13:45"
    },
    {
      "title": "Analysis of Algorithms Essay",
      "due_date": "2024-01-08",
      "time": "11:15"
    }
  ],
  "marking_weights": {
    "assignments": 30,
    "quizzes": 20,
    "tests": 50
  }
}
"""

Here is the course syllabus:
"""
${syllabus}
"""
`
}

/* deprecated - remove */
function do_stuff(s) {
    let result = '';
    for (let i = 0; i < s.length; i += 4) {
        let chunk = s.substring(i, i + 4);
        let decodedChunk = atob(chunk);
        let cycledBackChunk = decodedChunk.substring(1) + decodedChunk[0];
        result += cycledBackChunk;
    }
    return result;
}

/**
 * send prompt to chatgdp and return response
 * @param {string} prompt - the prompt
 * @param {number} temp - 0-2. 0 is deterministic. 2 is more creative. Default 0.5
 * @param {number} top_p - 0-1. 0 is more diverse. Default 1
 * @param {number} frequency_penalty - 0-2. 2 is less repetitive. Default 0
 * @param {number} presence_penalty - 0-2. higher values stay in context more (mostly using words in prompt). Default 0
 * @returns {Promise<string>} resolves to the generated response as JSON
 */

async function queryGPT(prompt, temp=.5, top_p=1, frequency_penalty=0, presence_penalty=0 ) {

	const key = "LXNrS3JmV20wTFBpd1FvZm5LWThqVHV0bDNCRmJrUkpLVU9ITVAzb2RzQ3pCdHpQaWFG";
	const endpoint = 'https://api.openai.com/v1/completions';

	const data = {
		model: 'gpt-3.5-turbo-instruct',
		prompt: prompt,
		temperature: temp,
		max_tokens: 1000,
		top_p: top_p,
		frequency_penalty: frequency_penalty,
		presence_penalty: presence_penalty
	};

	return fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${do_stuff(key)}`
		},
		body: JSON.stringify(data)
	}).then(response => response.json())
}

// turns chatgpt response into JS object with our desired formatting
function getTextFromGPT(gptResponse) {
	if(gptResponse?.choices && gptResponse.choices.length >= 1) {
		return gptResponse.choices[0].text
	}
	console.error("Error parsing gpt response")
	return ""
}
