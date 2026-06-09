import prisma from "../../config/database.js";
import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authMiddleware.js";

export const createDiscussion = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { problemId, content } = req.body;

    if (!problemId || !content?.trim()) {
      res.status(400).json({
        success: false,
        error: "Problem ID and content are required",
      });
      return;
    }

    const discussion = await prisma.discussion.create({
      data: {
        problemId: Number(problemId),
        userId: req.user.id,
        content,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json({
      success: true,
      discussion,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to create discussion",
    });
  }
};

export const getProblemDiscussions = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const problemId = Number(req.params.problemId);

    const discussions = await prisma.discussion.findMany({
      where: {
        problemId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      discussions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch discussions",
    });
  }
};