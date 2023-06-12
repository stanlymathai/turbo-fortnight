const gremlin = require('gremlin');
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;

dc = new DriverRemoteConnection(
  `wss://${process.env.DB_INSTANCE}:${process.env.DB_PORT}/gremlin`,
  {}
);

const graph = new Graph();
const g = graph.traversal().withRemote(dc);

module.exports = {
  connect: async () => {
    await g
      .V()
      .limit(1)
      .count()
      .next()
      .then((res) => {
        if (res.value == 1) console.log('DB connected');
        dc.close();
      })
      .catch((error) => {
        console.log('DB CONNECTION ERROR', error);
        dc.close();
      });
  },
};
