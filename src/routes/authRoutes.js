const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/registrar", authController.registrar);
router.post("/login", authController.login);
// Nova rota para alterar cargo
router.put(
  "/usuarios/alterar-cargo/:id",
  authMiddleware(["ADMIN"]),
  authController.usuarioAlterarCargo,
);
// Rota para deletar usuário
router.delete(
    "/usuarios/deletar/:id",
    authMiddleware(["ADMIN"]),
    authController.deletarUsuario,
); 
// Rota para listar usuários (opcional, para fins de administração)
router.get(
  "/usuarios",
    authMiddleware(["ADMIN"]),
    authController.listarUsuarios,
);
module.exports = router;
