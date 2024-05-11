const { getUser } = require("../service/auth");

// force the user to be logged in
async function restrictAccess(req, res, next) {
   const userId = req.cookies?.uid;
   if (!userId) {
      req.flash('error', 'You have to be logged in to avail this service.');
      return res.redirect('/users/login');
   }

   const user = getUser(userId);
   if (!user) {
      req.flash('error', 'You have to be logged in to avail this service.');
      return res.redirect('/users/login');
   }

   req.user = user;
   next();
}


// if authenticated, set req.user
async function checkAuthentication(req, res, next) {
   const userUid = req.cookies?.uid;
   const user = getUser(userUid);
   req.user = user;
   next();
}

module.exports = {
   restrictAccess,
   checkAuthentication
};