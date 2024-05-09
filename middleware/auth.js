const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // Extract the token from the request header
    const token = req.header("x-auth-token");
    // If token is not present, return 401 Unauthorized with a message
    if (!token)
      return res.status(401).json({ msg: "No auth token, access denied" });

      console.log('STEP 1');

    // Verify the token using the secret key
    const verified = jwt.verify(token, "passwordKey");

    console.log('STEP 2');

    // Find the user associated with the token
    const user = await User.findById(verified.id);

    // If user is not found, return 401 Unauthorized with a message
    if (!user) return res.status(401).json({ msg: "User not found" });

    console.log('STEP 3');

    // Set the user id and token in the request object for further use
    req.user = verified.id;
    req.token = token;
    
    console.log('STEP 4');

    // Call the next middleware in the chain
    next();
  } catch (err) {
    console.log(`STEP 5 ${err}`);
    if(err.name==='JsonWebTokenError')
     res.status(401).json({ msg: "Invalid Token !" });

    else if(err.name==='TokenExpiredError')
     res.status(401).json({ msg: "Token has expired, please sign in again" });
   
    else
    // If any error occurs during the process, return 500 Internal Server Error with the error message
    res.status(500).json({ error: err.message });
  }
};


module.exports = auth;
