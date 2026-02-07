require("dotenv").config()
const express = require("express");
const cors = require("cors");
const path = require("path"); // Adicione esta linha
const app = express();
const hinosRoutes = require("../routes/hinosRoutes");
const authRoutes = require("../routes/authRoutes");

app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use("/api/hinos", hinosRoutes); 
app.use("/api/auth", authRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});