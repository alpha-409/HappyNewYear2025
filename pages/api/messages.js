import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { to = "everyone", content } = req.body;

    // 验证数据
    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "内容不能为空" });
    }

    // 保存留言到数据库
    const newMessage = await prisma.message.create({
      data: {
        to,
        content,
      },
    });

    return res.status(200).json(newMessage);
  } else if (req.method === "GET") {
    const { name } = req.query;

    // 查询相关的祝福
    const messages = await prisma.message.findMany({
      where: {
        to: name || "everyone", // 默认查询 everyone 的祝福
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(messages);
  }

  return res.status(405).json({ error: "方法不被允许" });
}
