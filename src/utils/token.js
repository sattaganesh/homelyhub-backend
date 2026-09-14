// ============================================================
// token.js - the small helpers used by login and signup
// ============================================================
//
// 1. signinToken
//    Creates the JWT token for the logged-in user.
//
// 2. createSendToken
//    Creates the token, stores it in a cookie, hides the
//    password, and sends the response.
//
// 3. defaultAvatarUrl
//    Creates a default avatar URL using the user's name.
//
// 4. filterObj
//    Keeps only the fields that we allow the user to update.
//
// ============================================================


// jsonwebtoken is the library used to create JWT tokens.
import jwt from "jsonwebtoken";


// ------------------------------------------------------------
// 1. MAKE THE TOKEN
// ------------------------------------------------------------
// id -> the user's MongoDB ID.
//
// The token contains the user's ID and is signed using the
// secret stored in the .env file.
//
// expiresIn determines how long the JWT remains valid.
const signinToken = (id) => {

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_KEY_EXPIRES_IN,
    }
  );
};


// ------------------------------------------------------------
// 2. MAKE TOKEN, PUT IT IN COOKIE, SEND RESPONSE
// ------------------------------------------------------------
// user       -> the user who just signed up or logged in
// statusCode -> 201 for signup, 200 for login
// res        -> Express response object
const createSendToken = (user, statusCode, res) => {

  // Step 1 - create the JWT token for this user.
  // user._id is the ID MongoDB gave the user.
  const token = signinToken(user._id);


  // Step 2 - create the cookie options.
  const cookieOptions = {

    // "expires" tells the browser when to remove the cookie.
    //
    // JWT_COOKIES_EXPIRES_IN contains the number of days.
    //
    // Example:
    // 60 days × 24 hours × 60 minutes × 60 seconds × 1000
    // = 60 days in milliseconds.
    expires: new Date(
      Date.now() +
      Number(process.env.JWT_COOKIES_EXPIRES_IN) *
      24 *
      60 *
      60 *
      1000
    ),

    // httpOnly means JavaScript running in the browser
    // cannot directly read this cookie.
    httpOnly: true,

    // sameSite controls when the browser sends the cookie.
    //
    // During development we use "lax".
    // In production we use "none" for cross-site requests.
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",

    // secure means the cookie is sent only through HTTPS.
    //
    // During local development we normally use HTTP,
    // so secure is false.
    secure: process.env.NODE_ENV === "production",
  };


  // Step 3 - send the JWT as a cookie.
  //
  // "jwt" is simply the name of our cookie.
  res.cookie("jwt", token, cookieOptions);


  // Step 4 - remove the password from the user object
  // before sending the response.
  //
  // This only changes the object in memory.
  // It does NOT change the password stored in MongoDB.
  user.password = undefined;


  // Step 5 - send the response to the client.
  //
  // The token is also included in the JSON response so that
  // you can easily see it while testing with Postman.
  res.status(statusCode).json({
    status: "Success",
    token,
    user,
  });
};


// ------------------------------------------------------------
// 3. DEFAULT AVATAR URL
// ------------------------------------------------------------
// If the user doesn't upload an avatar, this function creates
// a default profile image using ui-avatars.com.
//
// Example:
// "Ganesh" -> an avatar containing the letter G.
const defaultAvatarUrl = (name) =>

  "https://ui-avatars.com/api/?name=" +

  // encodeURIComponent makes the user's name safe for a URL.
  encodeURIComponent(name || "User") +

  // Avatar appearance settings.
  "&background=0e8b53&color=fff&size=256&bold=true";


// ------------------------------------------------------------
// 4. FILTER OBJECT
// ------------------------------------------------------------
// obj -> the object received from the client.
//
// allowedFields -> fields that we are willing to accept.
//
// Example:
//
// filterObj(req.body, "name", "phoneNumber")
//
// will only keep:
// {
//   name: "...",
//   phoneNumber: "..."
// }
//
// If someone sends:
// {
//   name: "...",
//   role: "admin"
// }
//
// "role" will be removed because it wasn't allowed.
const filterObj = (obj, ...allowedFields) => {

  // Start with an empty object.
  const newObj = {};


  // Get all the fields sent by the client.
  Object.keys(obj).forEach((field) => {

    // Check whether this field is in our allowed list.
    if (allowedFields.includes(field)) {

      // If allowed, copy it into the new object.
      newObj[field] = obj[field];
    }
  });


  // Return only the allowed fields.
  return newObj;
};


// ------------------------------------------------------------
// EXPORTS
// ------------------------------------------------------------
// These names MUST match the names used when importing them
// in authcontrollers.js.
export {
  signinToken,
  createSendToken,
  defaultAvatarUrl,
  filterObj
};