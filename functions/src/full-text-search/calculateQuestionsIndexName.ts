export function calculateQuestionsIndexName(tenantId:string, courseId:string) {
  return `${tenantId}_${courseId}_questions_and_answers`
}
