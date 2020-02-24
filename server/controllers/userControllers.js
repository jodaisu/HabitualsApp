const db = require('../models/models.js');
const { google } = require('googleapis')


const client_secret = require('../../client_secret/client_secret')

const userControllers = {};


// OATH STARTS HERE
// controller to generate login url
userControllers.getLoginUrl = (req, res, next) => {
  // initialize a config object
  const googleConfig = {
    clientId: '371087135-djckvfenrkntg92agsc5c7csq2d3cej1.apps.googleusercontent.com',
    clientSecret: client_secret,
    redirect: 'http://localhost:8080/' 
  };
  
  //Create the google auth object which gives us access to talk to google's apis.
  const createConnection = () => {
    return new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirect
    );
  }

  //This scope tells google what information we want to request.
  const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  // Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events)
  const getConnectionUrl = (auth) => {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
      scope: defaultScope
    });
  }


  // Create the google url to be sent to the client.
  const urlGoogle = () => {
    const auth = createConnection(); // this is from previous step
    const url = getConnectionUrl(auth);
    return url;
  }
  



  
  // first time the page loads
  console.log(urlGoogle())
  res.locals.loginUrl = urlGoogle();
  next();
}



userControllers.getGoogleId = (req, res, next) => {
  next();
}
/// OATH ENDS HERE



// controller to post a user's form info to db
userControllers.updateUserHabits = (req, res, next) => {
  db.query(`INSERT INTO user_habits (users_id, habits_id, memo, routine_id, start_date, end_date, created_date) 
            VALUES (${req.body.usersId}, ${req.body.habitsId}, '${req.body.memo}', ${req.body.routineId}, '${req.body.startDate}', '${req.body.endDate}', NOW())`,
    (err, results) => {
      // results return an empty array?
      if (err) return next(err);
      console.log('successful post!');
      next();
    });
};

module.exports = userControllers;