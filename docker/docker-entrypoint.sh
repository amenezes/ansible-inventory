#!/usr/bin/env sh
set -e

gunicorn -w 2 -b 0.0.0.0:5000 --log-file - --access-logfile - run:app
