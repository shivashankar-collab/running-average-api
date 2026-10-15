const number = Number(process.argv[2]);
const endpoint = process.argv[3] || "http://localhost:3000/average";

if (process.argv.length < 3 || !Number.isFinite(number)) {
  process.stderr.write(
    "Usage: node client/submit-number.js <number> [endpoint]\n"
  );
  process.exitCode = 1;
} else {
  async function submitNumber() {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Request failed (${response.status})`);
      }

      process.stdout.write(`${JSON.stringify(result)}\n`);
    } catch (error) {
      process.stderr.write(`${error.message}\n`);
      process.exitCode = 1;
    }
  }

  submitNumber();
}
