# Nussbaum

[![Build Status](https://travis-ci.org/ikarulus/Nussbaum.svg?branch=master)](https://travis-ci.org/ikarulus/Nussbaum)

**This is currently not meant to be used in production.**

Nussbaum aims to be a simplistic solution for (IT-) Helpdesk systems where Jira, Redmine and others seem too big. With this I aim for the IT-departments of e.g. schools.

Insted of admin/user privilege management, access/edit privileges are reputation based. It does *only* support ticket management and nearly nothing else.
With the first stable release it may provide these features:

* Public ticket endpoint
* RESTful API and Backend
* Email notification
* Public/Private comments on support tickets
* Seamless wiki integrations (as it provides no wiki)

## Installation (using npm):
1. `git clone https://github.com/ikarulus/Nussbaum-Backend.git`
2. `cd` in your "Nussbaum-Backend" directory
3. `npm install`
4. Install [MongoDB](https://docs.mongodb.com/manual/installation/) and [Redis](https://redis.io/topics/quickstart)
5. Wire up MongoDB and Redis database connection in the configuration file
6. (Optional, for arch users) Start databases with `./start_dbs.sh`. Must be executable. For other distros you have to find your own way.
7. Launch via `node app.js` or `npm start`

## Screenshots
![Screenshot](https://user-images.githubusercontent.com/20602537/38381227-6dae4584-3906-11e8-92e6-c8740a6319cd.png)


## Security
**I wouldn't deploy this in a large scale. As I'm not an experienced JS developer I can't guarantee for anything including slain kitten.**
I try to integrate several security best practises. See TODO. Please consider using SLL/TLS - e.g. via nginx reverse proxy and letsencrypt's free certificates.

## TODO
### first release
:key:: Security
- [x] ticket endpoint
    - [x] integrate rate limiting for Public ticket endpoint :key:
- [ ] node multithreading
- [ ] security check :key:
    - [ ] xss
    - [ ] packages
    - [ ] intercept all errors
- [ ] rename application

### later releases
- [ ] wiki integration
- [ ] Docker
    [ ] Container
    [ ] Compose