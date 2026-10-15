# Running average API

This API returns the average of all valid numbers sent to it since the server started. The values are kept in memory, so restarting the server resets the average.

## Install and run

1. Install Node.js 18 or newer.
2. From the project folder, install the dependencies:

   ```sh
   npm install
   ```

3. Start the server:

   ```sh
   npm start
   ```

The server listens at `http://localhost:3000`. Keep it running while you make requests. To use a different port, set the `PORT` environment variable before starting it.

## Send a number

Send a number directly in the JSON request body:

```sh
curl -X POST http://localhost:3000/average -H "Content-Type: application/json" -d '10'
```

You can also send it in a `number` field:

```sh
curl -X POST http://localhost:3000/average -H "Content-Type: application/json" -d '{"number": 10}'
```

The response contains the updated average, for example `{"average":10}`. Each valid request counts once. Invalid requests return `400` and do not change the average.

Or submit a number with the included command-line client:

```sh
node client/submit-number.js 10
```

If the API is running at a different URL, pass that URL after the number.

## Run the tests

1. Stop the server if it is running.
2. From the project folder, run:

   ```sh
   npm test
   ```

The tests start their own temporary server and check valid numbers, running averages, invalid input, and malformed JSON.

## Commit messages

Running `npm install` also installs the Git hook. It checks that commit messages follow the Conventional Commits format.
