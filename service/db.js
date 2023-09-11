const gremlin = require('gremlin');
const { DriverRemoteConnection } = gremlin.driver;

const { Graph } = gremlin.structure;
const { createPool } = require('generic-pool');

function establish_connection() {
  if (!process.env.DB_INSTANCE || !process.env.DB_PORT) {
    throw new Error(
      'DB_INSTANCE or DB_PORT is not defined in environment variables.'
    );
  }

  let dc;
  try {
    dc = new DriverRemoteConnection(
      `wss://${process.env.DB_INSTANCE}:${process.env.DB_PORT}/gremlin`,
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
    console.log(
      '❌ [GREMLIN INIT ERROR] Failed to initialize Gremlin connection:',
      error.message
    );
    if (dc) {
      dc.close(); // Close connection if it was established
    }
    throw new Error(
      'Failed to initialize Gremlin connection: ' + error.message
    );
  }
}

// Connection pool configuration
const conn = createPool(
  {
    create: establish_connection,
    destroy: (conn) => conn.close(),
  },
  { max: 10, min: 2 }
);

// Log connection pool events
function logPoolError(message, error) {
  console.log(`❌ [DB CONNECTION POOL] - ${message}:`, error.message);
}

conn.on('factoryCreateError', (e) => logPoolError('Failed to create', e));
conn.on('factoryDestroyError', (e) => logPoolError('Failed to destroy', e));

conn.on('acquireError', (e) => logPoolError('Failed to acquire', e));
conn.on('releaseError', (e) => logPoolError('Failed to release', e));

async function test_conn() {
  let client;
  try {
    client = await conn.acquire();
    const result = await client.g.V().limit(1).count().next();
    if (result.value === 1) {
      console.log('✔️ [DB CONNECTION TEST] - Successful');
    } else {
      console.log('⚠️ [DB CONNECTION TEST] - Unexpected result:', result.value);
    }
  } catch (error) {
    console.log('❌ [DB CONNECTION TEST] - Error:', error.message);
  } finally {
    if (client) {
      conn.release(client);
    }
  }
}

module.exports = { conn, test_conn };
