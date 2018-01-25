#!/bin/bash
mongod --dbpath db &
systemctl start redis.service &
