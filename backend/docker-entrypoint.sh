#!/bin/sh
set -e

if [ -d prisma ]; then
  yarn prisma generate
fi

exec "$@"
