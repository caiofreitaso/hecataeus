#!/bin/bash

TEST_PSQL="
\echo '1';
\echo '2';
"

su -c "psql -h localhost -p 5432 -U postgres << EOF
${TEST_PSQL}
EOF
"