#!/usr/bin/env bash
mongod --dbpath db &
redis-server --appendonly no --save "" &