const router  = require("express").Router();
const { createUser, findUserByEmail } = require("../store");
const { signToken } = require("../utils/jwt");

/* POST /api/auth/register */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "name, email and password are required" });

    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(409).json({ error: "Email already registered" });

    const user   = await createUser({ name, email, password });
    const token  = signToken({ id: user._id });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed", detail: err.message });
  }
});

/* POST /api/auth/login */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await user.matchPassword(password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = signToken({ id: user._id });
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed", detail: err.message });
  }
});

module.exports = router;
