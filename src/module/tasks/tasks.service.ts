import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

import { PrismaService } from 'src/provider/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ListTasksDto } from './dto/list-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    try {
      return await this.prismaService.task.create({
        data: {
          user: {
            connect: { id: userId },
          },
          title: createTaskDto.title,
          description: createTaskDto.description,
          status: createTaskDto.status,
          dueDate: createTaskDto.dueDate,
          tags: {
            connect: createTaskDto.tagIds?.map((id) => ({ id })),
          },
          category: createTaskDto.categoryId
            ? { connect: { id: createTaskDto.categoryId } }
            : undefined,
        },
      });
    } catch {
      throw new BadRequestException('Failed to create task');
    }
  }

  async findAll(userId: string, dto: ListTasksDto) {
    const [list, count] = await this.prismaService.$transaction([
      this.prismaService.task.findMany({
        where: {
          userId,
          title: {
            contains: dto.title,
            mode: 'insensitive',
          },
        },
        ...dto.toPrismaPaging(),
        select: {
          category: true,
          createdAt: true,
          id: true,
          description: true,
          dueDate: true,
          status: true,
          tags: true,
          title: true,
        },
      }),
      this.prismaService.task.count({
        where: {
          userId,
          title: {
            contains: dto.title,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return dto.createResponse(list, count);
  }

  async findOne(id: string) {
    const task = await this.prismaService.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.prismaService.task.update({
        where: { id },
        data: updateTaskDto,
      });
      return task;
    } catch {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.task.delete({ where: { id } });
      return {};
    } catch {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
