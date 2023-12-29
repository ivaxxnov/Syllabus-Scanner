/*
Seperate Function for building query GPT function.
*/

/**
 * takes a syllabus and returns a JSON string with the wanted data, in the established format
 * @param syllabus the syllabus
 * @returns {Promise<string | string>} the JSON as a string
 */
function parse_syllabus(syllabus) {
	return queryGPT(syllabus).then(response_1 => {
		return getTextFromGPT(response_1);
	}).catch(error => {
		console.error('Error:', error);
		return ""
	});
}

// builds the prompt given the syllabus
function buildSystemPrompt() {
	return (
`You are part of a syllabus parsing application; this app takes a syllabus from any class, and returns a calendar file so students can see upcoming assignments etc, and a spreadsheet so students can quickly calculate their grades.
This should be able to work on any syllabus for any class.

Your role is to parse any syllabus and create a JSON object containing specific information about the school course from the given syllabus. The JSON that output must match the formatting of the JSON object below. Do not modify the overall structure or add any fields to the parent object. Obviously, you must change the values to match the given syllabus.

You must parse the syllabus and find ALL homeworks, assignments, work sheets, problem sets, assessments, forms, reviews, reports, essays, reflections, presentations, quizzes, tests, exams, projects, webworks, agreements, etc in the syllabus if they exist and add them to the JSON. Everything in the class should be added. Do not exclude any items from the syllabus, or else they won't be included in the calendar and students may miss something important.

If something occurs weekly or must be handed in/completed weekly, create a different object inside the schedule array for each week. 
If there is a weekly assignment due on Tuesdays for example, you can simply say "Assignment Week 1" for the first assignment, "Assignment Week 2" for the second assignment, up until the semester is over; semesters are 12 weeks long.

For biweekly assignments, repeat the same process, but skip a week each time.

The time attribute is for the time of day that an assignment is due, or the time of day when an assessment starts (like a quiz, test, or exam).
If you are unsure of what time something is at, leave the field as TBD. Only do this if you do not know.

The marking_weight object tells the user how they are graded in this course. The fields in this object should tell the user what percent of their mark is attributed to what in the course. Usually the keys relate the the schedule objects.
		
Here is format of the JSON you will output:
"""
{
  "subject": "COMP 101 Computer Science",
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
	  "time": "TBD"
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
"""`
)
}

function buildUserPrompt(syllabus) {
	return (
`Here is the syllabus for my course, please given me the corresponding JSON file:
"""
${syllabus}
"""`
	)
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

async function queryGPT(syllabus, temp=.5, top_p=1, frequency_penalty=0, presence_penalty=0 ) {

	const key = "LXNrS3JmV20wTFBpd1FvZm5LWThqVHV0bDNCRmJrUkpLVU9ITVAzb2RzQ3pCdHpQaWFG";
	const endpoint = 'https://api.openai.com/v1/chat/completions';

	const systemPrompt = buildSystemPrompt()
	const userPrompt = buildUserPrompt(syllabus)

	const data = {
		model: 'gpt-3.5-turbo-1106',
		temperature: temp,
		max_tokens: 3000,
		top_p: top_p,
		frequency_penalty: frequency_penalty,
		presence_penalty: presence_penalty,
		response_format: { "type": "json_object" },
		messages: [
			{
				role:"system",
				content:systemPrompt
			},
			{
				role:"user",
				content:userPrompt
			}
		]
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
		console.log(gptResponse)
		return gptResponse['choices'][0]['message']['content']
	}
	console.error("Error parsing gpt response")
	return ""
}
