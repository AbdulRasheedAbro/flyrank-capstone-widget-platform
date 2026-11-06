async function sendConfirmation(submission) {
  try {
    console.log('[SIDE-EFFECT] confirmation email queued for submission ' + submission.id);
  } catch (e) {
    console.error('[SIDE-EFFECT FAILED]', e.message);
  }
}
module.exports = { sendConfirmation };