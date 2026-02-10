const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SENHA_MESTRA_ADMIN = process.env.SENHA_CADASTRO_ADMIN;

// Lógica de Interrupção para Músicos e Administradores:
const authController = {
  registrar: async (req, res) => {
    try {
      const { nome, email, senha, cargoDesejado, chaveAcesso } = req.body;

      let roleFinal = "USER";

      if (cargoDesejado === "MUSICIAN") {
        const senhaMusicoEsperada = SENHA_CADASTRO_PARA_MUSICO;
        // Use a constante definida no topo para maior segurança
        if (chaveAcesso !== chaveAcesso.trim() !==  senhaMusicoEsperada) {
          return res.status(403).json({ erro: "Chave de músico inválida." });
        }
        roleFinal = "MUSICIAN";
      }

      if (cargoDesejado === "ADMIN") {
        // MUDANÇA AQUI: Use SENHA_MESTRA_ADMIN que puxa do seu .env
        if (chaveAcesso !== SENHA_MESTRA_ADMIN) {
          return res.status(403).json({ erro: "Chave de admin inválida." });
        }
        roleFinal = "ADMIN";
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = await prisma.usuario.create({
        data: { nome, email, senha: senhaHash, role: roleFinal },
      });

      res
        .status(201)
        .json({ mensagem: "Usuário criado com sucesso!", role: roleFinal });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Rota de Login
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      // 1. Verificar se o usuário existe
      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario) {
        return res.status(401).json({ erro: "E-mail ou senha inválidos." });
      }

      // 2. Verificar a senha criptografada
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: "E-mail ou senha inválidos." });
      }

      // 3. Gerar o Token JWT (O Crachá)
      const token = jwt.sign(
        { id: usuario.id, role: usuario.role }, // Dados salvos no token
        process.env.JWT_SECRET, // Chave mestra do seu arquivo .env
        { expiresIn: "1d" }, // O login dura 24 horas
      );

      // 4. Resposta com o Token e o Cargo
      res.status(200).json({
        mensagem: "Login bem-sucedido!",
        token: token,
        role: usuario.role,
        nome: usuario.nome,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deletarUsuario: async (req, res) => {
    const { id } = req.params;
    // Capturamos a senhaAdmin que o seu Frontend está enviando no "data: { senhaAdmin }"
    const { senhaAdmin } = req.body;

    try {
      // 1. Verificação de Segurança
      // Compara a senha enviada com a SENHA_CADASTRO_ADMIN do seu arquivo .env
      if (!senhaAdmin || senhaAdmin !== process.env.SENHA_CADASTRO_ADMIN) {
        return res
          .status(403)
          .json({ erro: "Senha de administrador incorreta. Acesso negado." });
      }

      // 2. Se a senha estiver correta, prossegue com a exclusão
      await prisma.usuario.delete({
        where: { id: id },
      });

      res
        .status(200)
        .json({ mensagem: "Usuário removido do ministério com sucesso." });
    } catch (error) {
      console.error("Erro ao deletar:", error);
      res
        .status(500)
        .json({ erro: "Erro interno ao tentar excluir o usuário." });
    }
  },
  usuarioAlterarCargo: async (req, res) => {
    const { id } = req.params;
    const { novoCargo } = req.body;
    try {
      await prisma.usuario.update({
        where: { id },
        data: { role: novoCargo },
      });
      res.json({ mensagem: "Cargo atualizado!" });
    } catch (err) {
      res.status(500).json({ erro: "Erro ao atualizar." });
    }
  },
  listarUsuarios: async (req, res) => {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: { id: true, nome: true, email: true, role: true },
      });
      res.json(usuarios);
    } catch (err) {
      res.status(500).json({ erro: "Erro ao listar usuários." });
    }
  },
};

module.exports = authController;
