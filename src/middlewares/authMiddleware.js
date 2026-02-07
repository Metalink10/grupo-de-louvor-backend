const jwt = require("jsonwebtoken");

const authMiddleware = (rolesPermitidas = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Verifica se o header existe
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Token de autenticação ausente ou inválido. Faça login ou cadastre-se." });
    }

    // 2. Extrai apenas o token (remove a palavra 'Bearer')
    const [, token] = authHeader.split(" ");

    try {
      // 3. Valida o token com a sua chave secreta do .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = decoded; // Salva os dados do usuário na requisição

      // 4. Verificação de Cargo (RBAC)
      if (rolesPermitidas.length > 0 && !rolesPermitidas.includes(decoded.role)) {
        return res
          .status(403)
          .json({ error: "Você não tem permissão para acessar este recurso." });
      }

      next(); // Passa para a próxima função (o Controller)
    } catch (error) {
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }
  };
};

module.exports = authMiddleware;