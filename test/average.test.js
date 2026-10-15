const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { createApp } = require("../src/app");

let server;
let endpoint;

async function submit(number) {
  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(number)
  });
}

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  endpoint = `http://127.0.0.1:${server.address().port}/average`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("uses the first number as the average", async () => {
  const response = await submit({ number: 10 });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { average: 10 });
});

test("averages numbers from both supported request formats", async () => {
  const response = await submit(20);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { average: 15 });
});

test("ignores invalid values", async () => {
  const invalidResponse = await submit({ number: "30" });
  const nextResponse = await submit({ number: 30 });

  assert.equal(invalidResponse.status, 400);
  assert.deepEqual(await nextResponse.json(), { average: 20 });
});

test("returns an error for malformed JSON", async () => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{"
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: "Request body must be valid JSON."
  });
});
