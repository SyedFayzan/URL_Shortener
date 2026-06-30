const bcrypt = require("bcrypt");
const User = require("../models/user");
const { setUser } = require("../service/auth");

const SALT_ROUNDS = 10;

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.render("signup", { error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", { error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.redirect("/login");
  } catch (err) {
    console.error(err);
    return res.render("signup", { error: "Something went wrong, please try again" });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login", { error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { error: "Invalid email or password" });
    }

    const token = setUser(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      // secure: true, // enable once served over HTTPS
    });

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.render("login", { error: "Something went wrong, please try again" });
  }
}

function handleUserLogout(req, res) {
  res.clearCookie("token");
  return res.redirect("/login");
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
};