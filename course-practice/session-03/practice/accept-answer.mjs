import { coachScenario } from '../src/scenarios.mjs';

// Input is untrusted JSON text; return true only for the exact scenario contract.
export function acceptAnswer(text, scenarioId) {
  const scenario = coachScenario(scenarioId);
  if (!scenario || typeof text !== 'string') return false;

  let answer;
  try {
    answer = JSON.parse(text);
  } catch {
    return false;
  }

  if (answer === null || typeof answer !== 'object' || Array.isArray(answer)) {
    return false;
  }

  const fields = ['kind', 'ruleId', 'cardId', 'explanation'];
  if (Object.keys(answer).length !== fields.length ||
      !fields.every(field => Object.hasOwn(answer, field))) {
    return false;
  }

  const expectedCardId = scenario.kind === 'suggest' ? 'practice-red-3' : null;
  return answer.kind === scenario.kind &&
    answer.ruleId === scenario.rule &&
    answer.cardId === expectedCardId &&
    typeof answer.explanation === 'string' &&
    answer.explanation.length >= 10 &&
    answer.explanation.length <= 1200;
}
