import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProcessTree {
  id: string;
  name: string;
  description?: string | null;
  area: any;
  parentProcess?: any;
  subprocesses: ProcessTree[];
}

export const getAllProcesses = async (req: Request, res: Response) => {
  try {
    const processes = await prisma.process.findMany({
      include: {
        area: true,
        parentProcess: true
      }
    });
    res.json(processes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch processes' });
  }
};

export const createProcess = async (req: Request, res: Response) => {
  const {
    name,
    description,
    areaId,
    parentProcessId,
    status,
    priority,
    tools,
    responsible,
    documentation
  } = req.body;

  try {
    const newProcess = await prisma.process.create({
      data: {
        name,
        description,
        area: { connect: { id: areaId } },
        parentProcess: parentProcessId ? { connect: { id: parentProcessId } } : undefined,
        status,
        priority,
        tools,
        responsible,
        documentation
      },
      include: {
        area: true,
        parentProcess: true
      }
    });
    res.status(201).json(newProcess);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create process' });
  }
};

export const getProcessTree = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const buildTree = async (processId: string): Promise<ProcessTree | null> => {
      const process = await prisma.process.findUnique({
        where: { id: processId },
        include: {
          area: true,
          subprocesses: true
        }
      });

      if (!process) return null;

      const children: ProcessTree[] = (
        await Promise.all(
          process.subprocesses.map(async (sub: { id: string }) => await buildTree(sub.id))
        )
      ).filter((child): child is ProcessTree => child !== null);

      return {
        ...process,
        subprocesses: children
      };
    };

    const tree = await buildTree(id);
    if (!tree) return res.status(404).json({ error: 'Process not found' });

    return res.json(tree);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to build process tree' });
  }
};

export const getProcessById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const process = await prisma.process.findUnique({
      where: { id },
      include: {
        area: true,
        parentProcess: true,
        subprocesses: true
      }
    });

    if (!process) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    return res.json(process);
  } catch (error) {
    console.error('Erro ao buscar processo:', error);
    return res.status(500).json({ error: 'Falha ao buscar processo' });
  }
};

export const getSubprocesses = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const subprocesses = await prisma.process.findMany({
      where: { parentProcessId: id },
      include: {
        area: true,
        parentProcess: true
      }
    });

    res.json(subprocesses);
  } catch (error) {
    console.error('Erro ao buscar subprocessos:', error);
    res.status(500).json({ error: 'Falha ao buscar subprocessos' });
  }
};

export const deleteProcess = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const process = await prisma.process.findUnique({ 
      where: { id },
      include: { subprocesses: true }
    });

    if (!process) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    if (process.subprocesses && process.subprocesses.length > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir processo com subprocessos',
        subprocesses: process.subprocesses.map((subprocess: any) => subprocess.id) 
      });
    }

    await prisma.process.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir processo:', error);
    res.status(500).json({ error: 'Falha ao excluir processo' });
  }
};

export const updateProcess = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const existingProcess = await prisma.process.findUnique({ where: { id } });
    if (!existingProcess) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    const updatedProcess = await prisma.process.update({
      where: { id },
      data: {
        name: updateData.name,
        description: updateData.description,
        isSystem: updateData.isSystem,
        status: updateData.status,
        priority: updateData.priority,
        tools: updateData.tools,
        responsible: updateData.responsible,
        documentation: updateData.documentation,
        area: updateData.areaId ? { connect: { id: updateData.areaId } } : undefined,
        parentProcess: updateData.parentProcessId 
          ? { connect: { id: updateData.parentProcessId } } 
          : updateData.parentProcessId === null 
            ? { disconnect: true } 
            : undefined
      },
      include: {
        area: true,
        parentProcess: true
      }
    });

    res.json(updatedProcess);
  } catch (error) {
    console.error('Erro ao atualizar processo:', error);
    res.status(400).json({ 
      error: 'Falha ao atualizar processo',
      details: error instanceof Error ? error.message : undefined
    });
  }
};
