#/bin/bash

APT_PACKAGES="screen locate libapache2-mod-tile \
    renderd git tar unzip wget bzip2 apache2 \
    lua5.1 mapnik-utils python3-mapnik \
    python3-psycopg2 python3-yaml gdal-bin \
    node-carto postgresql postgresql-contrib \
    postgis postgresql-15-postgis-3 \
    postgresql-15-postgis-3-scripts osm2pgsql \
    net-tools curl"

GIS_DB_INIT="
CREATE EXTENSION postgis;
CREATE EXTENSION hstore;
ALTER TABLE geometry_columns OWNER TO _renderd;
ALTER TABLE spatial_ref_sys OWNER TO _renderd;
"
OSM_CARTO_DIR="/opt/openstreetmap-carto"

su -c "apt install ${APT_PACKAGES}"
su -c "createuser _renderd; createdb -E UTF8 -O _renderd gis; psql -h localhost -p 5432 -U postgres << EOF
${GIS_DB_INIT}
EOF
" postgres
su -c "mkdir ${OSM_CARTO_DIR}; chmod u+wrx,g+wrx,o+wrx ${OSM_CARTO_DIR}"

git clone https://github.com/gravitystorm/openstreetmap-carto "${OSM_CARTO_DIR}"
cd "${OSM_CARTO_DIR}"
git switch --detach v5.9.0
carto project.mml > mapnik.xml