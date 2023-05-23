# Quick-Talk

Quick-Talk is a feature-rich MERN stack application that enables users to send messages over the internet in real-time. The application utilizes JWT (JSON Web Tokens) and bcrypt authentication for secure user authentication and authorization. Additionally, it incorporates real-time messaging functionality and a notification system to enhance the user experience.

## Features

1. **User Authentication:** Quick-Talk implements secure user authentication using JWT (JSON Web Tokens) and bcrypt. Users can create accounts, log in, and log out securely.

2. **Real-time Messaging:** The application enables users to send and receive messages in real-time. Users can engage in private conversations or participate in group chats, making communication seamless and interactive.

3. **Notification System:** Quick-Talk includes a notification system that keeps users updated with new messages and other important events. Users will receive notifications when they receive new messages or when there are updates in their conversations.

4. **User Profiles:** Each user has a dedicated profile page where they can view and manage their personal information. Users can update their profile picture, edit their bio, and customize their settings according to their preferences.

5. **Search Functionality:** Quick-Talk allows users to search for other users by name or username. This feature makes it easy to find and connect with friends and colleagues within the application.

6. **Responsive Design:** Quick-Talk is designed to be responsive, ensuring that the application adapts to different screen sizes and devices. Users can access the application from desktops, tablets, or mobile devices with a consistent user experience.

## Installation

To install and run Quick-Talk locally, follow these steps:

1. Clone the repository: `git clone https://github.com/hardiksharma11/Quick-Talk`
2. Navigate to the project directory: `cd quick-talk`
3. Install the server dependencies: `npm install`
4. Navigate to the client directory: `cd frontend`
5. Install the client dependencies: `npm install`
6. Go to the server directory: `cd ..`
7. Start the development server: `npm run dev`

Make sure you have MongoDB installed and running on your local machine.

## Configuration

Before running the application, you need to set up the following configuration variables:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key used for JWT token generation
- `PORT`: Port number for the server to run on

You can set these variables in a `.env` file in the root directory of the project.

## Technologies Used

Quick-Talk is built using the following technologies:

- **Front-end**: React, Socket.IO, HTML, CSS
- **Back-end**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, bcrypt

## Contributing

Contributions to Quick-Talk are welcome! If you find any bugs or want to add new features, please submit an issue or a pull request on the GitHub repository.


