#!/bin/bash
mongod --dbpath testdb &
systemctl start redis.service &
