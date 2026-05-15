// FINLIT — Vocabulary Enforcer
// Light-touch post-processing: replaces generic financial terms with domain-specific ones
// when the AI response contains none of the domain vocabulary.
// Primary enforcement is via system prompts — this is a safety net only.

const { normalizeDomain } = require('../config/finnPersonalities');

// Word-boundary replacements: [pattern, replacement, domain-check-word]
// Only fires when the replacement word is NOT already present in the text.
const RULES = {
  gaming: [
    [/\b(your money)\b/gi,    'your gold',        'gold'],
    [/\bsave up\b/gi,         'stockpile',         'stockpile'],
    [/\btime period\b/gi,     'grind window',      'grind'],
    [/\byou invest\b/gi,      'you level up',      'level up'],
    [/\bover time\b/gi,       'through consistent grinding', 'grinding'],
  ],
  fashion: [
    [/\b(your money)\b/gi,    'your capital',      'capital'],
    [/\bsave up\b/gi,         'build your reserves', 'curating'],
    [/\btime period\b/gi,     'across seasons',    'season'],
    [/\byou invest\b/gi,      'you acquire',       'curating'],
  ],
  sports: [
    [/\b(your money)\b/gi,    'your draft capital', 'capital'],
    [/\bsave up\b/gi,         'build your depth',  'depth'],
    [/\btime period\b/gi,     'training window',   'training'],
    [/\byou invest\b/gi,      'you draft',         'draft'],
  ],
  movies: [
    [/\b(your money)\b/gi,    'your budget',       'budget'],
    [/\bsave up\b/gi,         'build your production fund', 'production'],
    [/\btime period\b/gi,     'production timeline', 'production'],
    [/\byou invest\b/gi,      'you greenlight',    'greenlit'],
  ],
  food: [
    [/\b(your money)\b/gi,    'your ingredients',  'ingredients'],
    [/\bsave up\b/gi,         'build your pantry', 'pantry'],
    [/\btime period\b/gi,     'prep time',         'prep'],
    [/\byou invest\b/gi,      'you prepare',       'mise'],
  ],
  music: [
    [/\b(your money)\b/gi,    'your composition',  'composition'],
    [/\bsave up\b/gi,         'rehearse and build', 'rehearse'],
    [/\btime period\b/gi,     'movement',          'movement'],
    [/\byou invest\b/gi,      'you compose',       'compose'],
  ],
};

function enforceVocabulary(text, domain) {
  if (!text) return text;
  const key = normalizeDomain(domain);
  const rules = RULES[key];
  if (!rules) return text;

  let result = text;
  for (const [pattern, replacement, checkWord] of rules) {
    // Only apply if the replacement vocabulary isn't already present
    if (!result.toLowerCase().includes(checkWord.toLowerCase())) {
      result = result.replace(pattern, replacement);
    }
  }
  return result;
}

module.exports = { enforceVocabulary };
