const User = require("../model/user");

function randomUsername() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let username = "";
  for (let i = 0; i < 6; i++) {
    username += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return username;
}

function randomPassword() {
  const digits = "0123456789";
  let password = "";
  for (let i = 0; i < 6; i++) {
    password += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return password;
}

function randomUsername() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let username = "";
  for (let i = 0; i < 6; i++) {
    username += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return username;
}

function randomPassword() {
  const digits = "0123456789";
  let password = "";
  for (let i = 0; i < 6; i++) {
    password += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return password;
}

async function initializeDB(req, res) {
  try {
    for (let i = 0; i < 5; i++) {
      const username = randomUsername();
      const password = randomPassword();

      const newUser = new User({
        username: username,
        password: new User().hashPassword(password),
        loggedIn: 0,
        loggedInAt: null,
      });

      await newUser.save();
    }
    res.send("Database initialized.");
  } catch (error) {
    console.error("Error :", error);
    res.status(500).send("Error.");
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Tìm người dùng với username
    const user = await User.findOne({ username });

    if (!user) {
      console.error("User not found");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Kiểm tra mật khẩu
    if (!user.isPasswordMatched(password)) {
      return res.status(401).json({ result: "failed", userId: null });
    }

    // Cập nhật trạng thái đăng nhập và thời gian đăng nhập
    user.loggedIn = 1;
    user.loggedInAt = new Date();
    await user.save();

    res.json({ result: "success", userId: user._id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ result: "failed", userId: null });
  }
}
// Tạo hàm đăng ký để test API
async function register(req, res) {
  const { username, password } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!username || !password) {
    return res.status(400).json({
      result: "failed",
      message: "Username and password are required.",
    });
  }

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        result: "failed",
        message: "Username already exists.",
      });
    }

    // Tạo người dùng mới với mật khẩu đã mã hóa
    const newUser = new User({
      username,
      password: new User().hashPassword(password),
    });
    await newUser.save();

    res.status(201).json({
      result: "success",
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      result: "failed",
      message: "Error",
    });
  }
}

module.exports = { initializeDB, login, register };
