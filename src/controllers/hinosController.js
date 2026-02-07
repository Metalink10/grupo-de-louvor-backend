const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const hinoController = {
  // Rota para integrante do grupo criar hino
  criarHino: async (req, res) => {
    try {
      const { titulo, letra, autor } = req.body;

      // Busca o último número primeiro para evitar erro de variável indefinida
      const ultimoHino = await prisma.hino.findFirst({
        orderBy: { numero: "desc" },
      });
      const proximoNumero = ultimoHino ? ultimoHino.numero + 1 : 1;

      const novoHino = await prisma.hino.create({
        data: {
          titulo,
          letra,
          autor,
          numero: proximoNumero,
          cifra: req.file ? req.file.path : "",
        },
      });

      res.status(201).json({
        mensagem: "Criado com sucesso. Numero do hino: " + proximoNumero,
        novoHino,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Rota protegida para músicos e administradores
  criarHinoAdm: async (req, res) => {
    try {
      const { titulo, letra, autor, tom, cifraTexto } = req.body;

      const ultimoHino = await prisma.hino.findFirst({
        orderBy: { numero: "desc" },
      });
      const proximoNumero = ultimoHino ? ultimoHino.numero + 1 : 1;

      const novoHino = await prisma.hino.create({
        data: {
          titulo,
          letra,
          autor,
          tom,
          cifraTexto,
          numero: proximoNumero,
          cifra: req.file ? req.file.path : "",
        },
      });

      res.status(201).json(novoHino);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Rota de busca ajustada (Removido a duplicação que causava o erro de chaves)
  buscarHino: async (req, res) => {
    const { id } = req.params;
    const { numero, titulo } = req.query;

    try {
      let filtros = {};

      if (id) {
        filtros.id = id;
      }

      if (numero) {
        filtros.numero = parseInt(numero);
      }

      if (titulo) {
        filtros.titulo = {
          contains: titulo,
          mode: "insensitive",
        };
      }

      const hinos = await prisma.hino.findMany({
        where: filtros,
      });

      if (hinos.length === 0) {
        return res.status(404).json({ mensagem: "Nenhum hino encontrado." });
      }

      res.status(200).json(hinos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  atualizarHino: async (req, res) => {
    const { id } = req.params;
    const { titulo, tom, cifraTexto, letra, autor } = req.body;
    try {
      const hinoExistente = await prisma.hino.findUnique({
        where: { id: id },
      });
      
      if (!hinoExistente) {
        return res.status(404).json({ mensagem: "Hino não encontrado." });
      }

      const hinoAtualizado = await prisma.hino.update({
        where: { id: id },
        data: {
          titulo,
          tom,
          cifraTexto,
          letra,
          autor
        },
      });
      res.status(200).json(hinoAtualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listarTodos: async (req, res) => {
    try {
      const hinos = await prisma.hino.findMany({
        orderBy: { numero: "asc" },
      });
      
      if (hinos.length === 0) {
        return res.status(404).json({ mensagem: "Nenhum hino cadastrado." });
      }
      res.status(200).json(hinos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deletarHino: async (req, res) => {
    const { id } = req.params;
    try {
      const hinoExistente = await prisma.hino.findUnique({
        where: { id: id },
      });

      if (!hinoExistente) {
        return res.status(404).json({ mensagem: "Hino não encontrado." });
      }

      await prisma.hino.delete({
        where: { id: id },
      });

      res.status(200).json({ mensagem: "Hino deletado com sucesso." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = hinoController;