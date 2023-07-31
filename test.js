const jsonOutput = `{
    "error": [
        {
            "id": 1,
            "title": "MCQ",
            "answer": "Carbon dioxide",
            "options": [
                "Oxygen",
                "Carbon dioxide",
                "Hydrogen",
                "Nitrogen"
            ],
            "subject": "Science",
            "question": "Which gas is essential for photosynthesis?",
            "correct_answer": "Carbon dioxide"
        },
        {
            "id": 2,
            "title": "MCQ",
            "answer": "Au",
            "options": [
                "Au",
                "Go",
                "Gd",
                "Gl"
            ],
            "subject": "Science",
            "question": "What is the chemical symbol for gold?",
            "correct_answer": "Au"
        },
        {
            "id": 3,
            "title": "MCQ",
            "answer": "Mars",
            "options": [
                "Mars",
                "Venus",
                "Mercury",
                "Jupiter"
            ],
            "subject": "Science",
            "question": "Which planet is known as the 'Red Planet'?",
            "correct_answer": "Mars"
        },
        {
            "id": 4,
            "title": "MCQ",
            "answer": "Mars",
            "options": [
                "Atom",
                "Molecule",
                "Cell",
                "Proton"
            ],
            "subject": "Science",
            "question": "What is the smallest unit of an element?",
            "correct_answer": "Atom"
        },
        {
            "id": 5,
            "title": "MCQ",
            "answer": "3.14",
            "options": [
                "3.14",
                "3.16",
                "3.18",
                "3.12"
            ],
            "subject": "Math",
            "question": "What is the value of π (pi) to two decimal places?",
            "correct_answer": "3.14"
        },
        {
            "id": 6,
            "title": "MCQ",
            "answer": "3.14",
            "options": [
                "9",
                "8",
                "7",
                "10"
            ],
            "subject": "Math",
            "question": "What is the square root of 81?",
            "correct_answer": "9"
        }
    ]
}`;

// Parse the JSON string to JavaScript object
const data = JSON.parse(jsonOutput);

// Create an array to store the extracted information
const extractedData = [];

// Loop through the "error" array to extract "id" and "subject"
data.error.forEach(item => {
  const { id, subject } = item;
  extractedData.push({ id, subject });
});

console.log(extractedData);
