const path = require("path");

const viewHTML = async (req, res) => {
  try {
    return res.sendFile(path.resolve(__dirname, "../public/index.html"));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { viewHTML };
