const express = require("express");
const router = express.Router();
const hinoController = require("../controllers/hinosController");
const upload = require("../config/multer");
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");

router.post(
  "/integrante/criar",
  authMiddleware(["USER", "MUSICIAN", "ADMIN"]),
  hinoController.criarHino,
);
router.post(
  "/musico/admin",
  authMiddleware(["MUSICIAN", "ADMIN"]),
  upload.single("cifra"),
  hinoController.criarHinoAdm,
);
router.get(
  "/buscar/:id",
  authMiddleware(["USER", "MUSICIAN", "ADMIN"]),
  hinoController.buscarHino,
);

router.put(
  "/editar/:id",
  authMiddleware(["USER", "MUSICIAN", "ADMIN"]),
  upload.single("cifra"),
  hinoController.atualizarHino,
);

router.get(
  "/todos",
  authMiddleware(["USER", "MUSICIAN", "ADMIN"]),
  hinoController.listarTodos,
);

router.delete(
  "/deletar/:id",
  authMiddleware(["MUSICIAN", "ADMIN"]),
  hinoController.deletarHino,
);


module.exports = router;
