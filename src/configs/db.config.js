const gremlin = require('gremlin');
const { DriverRemoteConnection } = gremlin.driver;
const { Graph } = gremlin.structure;
const { createPool } = require('generic-pool');

// Environment variable validation & parsing
const { DB_INSTANCE, DB_PORT, DB_POOL_MAX, DB_POOL_MIN } = process.env;

if (!DB_INSTANCE || !DB_PORT) {
  throw new Error(
    'DB_INSTANCE or DB_PORT is not defined in environment variables.'
  );
}

const maxPoolSize = parseInt(DB_POOL_MAX, 10) || 10;
const minPoolSize = parseInt(DB_POOL_MIN, 10) || 2;

function establish_connection() {
  let dc;
  try {
    dc = new DriverRemoteConnection(
      `wss://${DB_INSTANCE}:${DB_PORT}/gremlin`,
      { mimeType: 'application/vnd.gremlin-v2.0+json' } // Fall back to GraphSON v2
    );

    const graph = new Graph();
    return {
      g: graph.traversal().withRemote(dc),
      close: () => {
        console.log('🔌 [GREMLIN] Closing connection...');
        dc && dc.close();
      },
    };
  } catch (error) {
    console.error(
      '❌ [GREMLIN INIT ERROR] Failed to initialize Gremlin connection:',
      error.message
    );
    dc && dc.close(); // Close connection if it was established
    throw error;
  }
}

const conn = createPool(
  {
    create: establish_connection,
    destroy: (conn) => conn.close(),
  },
  {
    max: maxPoolSize,
    min: minPoolSize,
  }
);

const logPoolError = (message, error) =>
  console.error(`❌ [DB CONNECTION POOL] - ${message}:`, error.message);

[
  'factoryCreateError',
  'factoryDestroyError',
  'acquireError',
  'releaseError',
  'destroyError',
].forEach((event) =>
  conn.on(event, (e) => logPoolError(`Failed to ${event.split('Error')[0]}`, e))
);

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 2000; // 2 seconds

async function test_conn(retries = 0) {
  let client;

  try {
    client = await conn.acquire();
    const result = await client.g.V().limit(1).count().next();

    if (result.value === 1) {
      console.log('✔️ [DB CONNECTION TEST] - Successful');
    } else {
      console.warn(
        '⚠️ [DB CONNECTION TEST] - Unexpected result:',
        result.value
      );
    }
  } catch (error) {
    console.error('❌ [DB CONNECTION TEST] - Error:', error.message);
    console.log(
      `❌ [DB CONNECTION TEST] - Retries: ${retries + 1}/${MAX_RETRIES}`
    );

    if (retries < MAX_RETRIES) {
      setTimeout(() => test_conn(retries + 1), RETRY_INTERVAL);
    } else {
      console.error('❌ [DB CONNECTION TEST] - Max retries reached. Exiting.');
      process.exit(1);
    }
  } finally {
    try {
      if (client) conn.release(client);
    } catch (releaseError) {
      console.error(
        '❌ [DB CONNECTION TEST] - Error releasing connection:',
        releaseError.message
      );
    }
  }
}

async function shutdown() {
  console.log('🔌 [DB CONNECTION POOL] - Closing connection pool...');
  try {
    await conn.drain();
    await conn.clear();
    console.log('🔌 [DB CONNECTION POOL] - Connection pool closed.');
    process.exit(0);
  } catch (error) {
    console.error(
      '❌ [DB CONNECTION POOL] - Failed to close connection pool:',
      error.message
    );
    process.exit(1);
  }
}

module.exports = { conn, test_conn, shutdown };
