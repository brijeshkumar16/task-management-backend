import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksDto } from './dto/list-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a task' })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  @ApiBearerAuth()
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user.sub);
  }

  @ApiOperation({ summary: 'Get a list of tasks' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved tasks',
    type: [CreateTaskDto],
  })
  @ApiBearerAuth()
  @Get()
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of tasks to retrieve',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Search tasks by title',
  })
  findAll(@Query() dto: ListTasksDto, @Request() req) {
    return this.tasksService.findAll(req.user.sub, dto);
  }

  @ApiOperation({ summary: 'Get task details by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved task' })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({ status: 200, description: 'Task successfully updated' })
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task successfully deleted' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
