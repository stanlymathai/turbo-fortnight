const gremlin = require('gremlin');
const { DriverRemoteConnection } = gremlin.driver;
const { Graph } = gremlin.structure;

module.exports = {
  gremlinHandler: () => {
    try {
      dc = new DriverRemoteConnection(
        `wss://${process.env.DB_INSTANCE}:${process.env.DB_PORT}/gremlin`,
        { mimeType: 'application/vnd.gremlin-v2.0+json' } // Fall back to GraphSON v2
      );
      const graph = new Graph();
      return {
        g: graph.traversal().withRemote(dc),
        closeConn: () => dc.close(),
      };
    } catch (error) {
      console.log('❌ [GREMLIN INIT ERROR]', error);
      throw new Error(error);
    }
  },
  testConnection: async () => {
    const { g, closeConn } = module.exports.gremlinHandler();

    await g
      .V()
      .limit(1)
      .count()
      .next()
      .then((res) => {
        if (res.value === 1) console.log('✔️', '[DB CONNECTION TEST]');
        closeConn();
      })
      .catch((error) => {
        console.log('❌ [DB CONNECTION ERROR]', error);
        closeConn();
      });
  },
};
