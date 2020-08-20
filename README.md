Hacker News API
=
NodeJS | ExpressJS

### API Endpoints
- GET **/health/** - basic api health check
- GET **/top-stories/** - retrieve top 10 stories from HN
- POST **/comments/storyID/** - retrieve top comments for given story ID
- GET **/past-stories/** - retrieve all stories served earlier

### Installation
- npm: Run `npm install` and `npm start`
- Docker: Build with Dockerfile and map _port 8080_ to your preferred port
