const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  loggedIn: {
    type: Number,
    default: 0,
  },
  loggedInAt: {
    type: Date,
    default: null,
  },
});

userSchema.methods.hashPassword = function (password) {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// Phương thức kiểm tra mật khẩu
userSchema.methods.isPasswordMatched = function (password) {
  return this.password === this.hashPassword(password);
};

// Hook trước khi lưu người dùng
userSchema.pre("save", function (next) {
  var user = this;

  // Chỉ băm mật khẩu nếu nó đã được thay đổi (hoặc là mới)
  if (!user.isModified("password")) return next();

  // Băm mật khẩu trước khi lưu
  user.password = user.hashPassword(user.password);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
