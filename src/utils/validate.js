export function require(value, message = "This field is require") {
  return value && String(value).trim() ? "" : message;
}

export function isEmail(value, message = "This field is require") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim())
    ? ""
    : message;
}

export function isPassword(value, message) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
    String(value).trim(),
  )
    ? ""
    : message;
}

export function checkContent(value, message) {
  return value.trim().length >= 10 ? "" : message;
}

export function checkFileSize(value, message = "File size must be less than 1MB", maxSizeMB = 1) {
  const sizeInMB = value.size / 1024 / 1024; // convert bytes to MB
  return sizeInMB <= maxSizeMB ? "" : message;
}

export function validates(value, rules = []) {
  // console.log(rules);
  for (const rule of rules) {
    // console.log(rule);
    let err = rule(value);
    // console.log(err);
    if (err) return err;
  }
}
