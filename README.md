# Language Flashcards

### Demo: https://www.language-flashcards.pl
### username: test_user password: test_user
## Technology stack

### DevOps
- Nginx
- Docker
### Backend 
- Django
### Frontend:
- React
- TypeScript
- Formik (to handle forms)

## Application technology description

The backend of this application is written in django framework. The application contains Login and Registration for user and requires the user to be logged in to use the application. Frontend of aplication is written in react and typescript. Forms are validated via Formik library and every input is validated by yup to prevent errors. Application utilizes Docker containers for seamless deployment and execution, while staticfiles are served via nginx. The application is hosted on vps server and with each approved PR it is built and reloaded automatically, thanks to github actions.


## Application allows to:

- Login user
- Register user
- Remind password
- Reset password
- Sending email notifications
- Converting files to decks
- Creating decks and words
- Removing decks and words
- Editing decks and words
- 4 types of methods to learn
- And much more :)

