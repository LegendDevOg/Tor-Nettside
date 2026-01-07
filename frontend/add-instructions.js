const fs = require('fs');
const path = require('path');

// Files to update
const files = [
  'A1-Lytting-Sett-2.json',
  'A1-Lytting-Sett-3.json',
  'A2-Lytting-Sett-1.json',
  'A2-Lytting-Sett-2.json',
  'A2-Lytting-Sett-3.json',
  'B1-Lytting-Sett-1.json',
  'B1-Lytting-Sett-2.json',
  'B1-Lytting-Sett-3.json'
];

// Instruction mapping based on question type
const getInstruction = (questionType) => {
  switch (questionType) {
    case 'image-click':
      return 'Klikk på bildet';
    case 'image':
      return 'Klikk på riktig bilde';
    case 'multiple':
      return 'Klikk på riktig svar';
    case 'multi_dropdown':
      return 'Fyll inn svarene';
    case 'dual_dropdown':
      return 'Fyll inn svarene';
    default:
      return 'Lytt til oppgaven';
  }
};

files.forEach(filename => {
  const filepath = path.join(__dirname, 'public', filename);
  
  try {
    // Read the JSON file
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    
    // Add instruction to each question
    const updated = data.map(question => {
      if (!question.instruction) {
        return {
          ...question,
          instruction: getInstruction(question.type)
        };
      }
      return question;
    });
    
    // Write back to file
    fs.writeFileSync(filepath, JSON.stringify(updated, null, 4));
    console.log(`✓ Updated ${filename}`);
  } catch (error) {
    console.error(`✗ Error processing ${filename}:`, error.message);
  }
});

console.log('Done!');

