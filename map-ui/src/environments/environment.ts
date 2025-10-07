const host = '192.168.0.57';

export const environment = {
  tileServer: {
    uri: `http://${host}/hot`,
    tileSize: 1024,
  },
  pgsql: {
    host,
    port: 5432,
    database: 'gis',
    username: 'osm',
    password: '123456',
  },
};
