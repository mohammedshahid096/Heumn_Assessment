# Heumn Interactive Project

## Deployment Link

[Production Deployment](http://your-deployment-link.com)

## Project Overview

This project implements a secure authentication system using access and refresh tokens. The access token is valid for 5 minutes, ensuring short-lived access to resources. The refresh token, valid for 3 days, allows users to obtain a new access token without re-authenticating. This setup balances security and usability by limiting the window for potential misuse while avoiding frequent logins.

### Authentication Details

- **Access Token**: Short-lived token (5 minutes) used for immediate access to resources. After expiry, a new access token must be obtained using the refresh token.
- **Refresh Token**: Longer-lived token (3 days) used to request a new access token without requiring user re-authentication.

### Benefits of Access and Refresh Tokens

- **Security**: Limits the duration an access token is valid, reducing the risk if a token is compromised.
- **User Experience**: Users do not need to log in frequently due to the longer validity of refresh tokens.

### API for Generating Access Token

A separate API endpoint is provided to generate a new access token using the refresh token.
http://localhost:8000/api/v1/user/get_access_token

### GraphQL Integration

A GraphQL interface is available at a separate URL, providing an interactive GUI for querying the API.

## Setup Instructions

### Clone the Project

```bash
git clone https://github.com/mohammedshahid096/Heumn_Assessment
cd Heumn_Assessment
```

### Create Database

- create a mongodb database before starting the server.
- database name will be : `HeumnInteractive`.
- can create with other database name also but make sure in the env db_url_dev there is also keeping the same name.

### Add env file

- file will be .env.
- .env file will be placed in root folder only.

```
# Port
PORT=8000
DEVELOPMENT_MODE=development


# MongoDB
DB_URL_DEV=mongodb://127.0.0.1:27017/HeumnInteractive

# JWT
## Activation Key
JWT_SECRET_KEY=KwRus3Gc7SYjTmrZyxtE8pd9g4UveqAQaV2Bk5NPCWDHbMLzfn
## Access Token
ACCESS_TOKEN_KEY=AMnjPNpwckHsh6ZB7rC5GdJzvxgLYTKfa9We2mQEtU3VubyFSX
ACCESS_TOKEN_KEY_TIME=5m
ACCESS_TOKEN_KEY_TIME_COOKIE=5
## Refresh Token
REFRESH_TOKEN_KEY=CHdNpD3tjyEKMh7Zc6zAsrJ9xUTuSgfLw2vQ5GBeVY8RqaPW4X
REFRESH_TOKEN_KEY_TIME=3d
REFRESH_TOKEN_KEY_TIME_COOKIE=3

# Access Origins
ALLOW_ORIGINS_ACCESS=["http://localhost:5173","http://localhost:3000"]
```

### Starting Server

```
npm install
npm start
```

### Api Documentation

- Refer to the provided API documentation [here](https://documenter.getpostman.com/view/28253165/2sA3QqgDJw) for details on available endpoints.
- https://documenter.getpostman.com/view/28253165/2sA3QqgDJw
- Added Postman-collection file is added in the root folder `Heumn_assignment.postman_collection.json`
- at this get request also api documentation is added "http://localhost:8000"

### GraphQL

- all the queries and mutations are added in the documentation.
- graphql-gui will be open on http://localhost:8000/gqlserver

## Credentials for Testing

Use the following credentials to login and test different roles:

| Role   | Email           | Password |
| ------ | --------------- | -------- |
| Admin  | admin@gmail.com | Test@123 |
| Member | test1@gmail.com | Test@123 |
| Member | test2@gmail.com | Test@123 |
