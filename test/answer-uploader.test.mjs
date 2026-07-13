import test from 'node:test';
import assert from 'node:assert/strict';
import { uploadAnswers } from '../components/answer-uploader.mjs';

test('completed answers are posted to the configured Google Apps Script endpoint', async () => {
  let request;
  await uploadAnswers({ zodiac: 'สิงห์' }, async (url, options) => { request = { url, options }; return {}; });

  assert.match(request.url, /script\.google\.com\/macros\/s\//);
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.mode, 'no-cors');
  assert.deepEqual(JSON.parse(request.options.body), { answers: { zodiac: 'สิงห์' } });
});
