import { Request, Response } from 'express';
import { prisma } from '../app';

export const getAllAreas = async (req: Request, res: Response) => {
  try {
    const areas = await prisma.area.findMany();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch areas' });
  }
};

export const createArea = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  
  try {
    const newArea = await prisma.area.create({
      data: {
        name,
        description
      }
    });
    res.status(201).json(newArea);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create area' });
  }
};

export const getAreaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const area = await prisma.area.findUnique({
      where: { id: id }
    });

    if (!area) {
      return res.status(404).json({ error: 'Área não encontrada' });
    }

    res.json(area);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao buscar área' });
  }
};

export const updateArea = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedArea = await prisma.area.update({
      where: { id: id },
      data: { name, description }
    });

    res.json(updatedArea);
  } catch (error) {
    res.status(400).json({ error: 'Falha ao atualizar área' });
  }
};

export const deleteArea = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const processes = await prisma.process.findMany({
      where: { areaId: id }
    });

    if (processes.length > 0) {
      return res.status(400).json({ error: 'Não é possível excluir uma área com processos cadastrados' });
    }

    await prisma.area.delete({
      where: { id: id}
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Falha ao deletar área' });
  }
};

export const getAreaProcesses = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const area = await prisma.area.findUnique({
      where: { id: id },
      include: { processes: true }
    });

    if (!area) {
      return res.status(404).json({ error: 'Área não encontrada' });
    }

    res.json(area.processes);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao buscar processos da área' });
  }
};
