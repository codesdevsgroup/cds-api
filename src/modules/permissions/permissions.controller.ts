import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../guards/require-permission.guard';
import { RequirePermission } from '../../decorators/require-permission.decorator';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@ApiTags('Permissions')
@UseGuards(AuthGuard('jwt'))
@UseGuards(PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @RequirePermission('permission', 'view')
  @Get('list')
  async listPermissions() {
    return this.permissionsService.listPermissions();
  }

  @RequirePermission('permission', 'view')
  @Get('/:id')
  async getPermissions(@Param('id') id: string) {
    return this.permissionsService.getPermissions(id);
  }

  @RequirePermission('permission', 'edit')
  @Post('/:id')
  async editPermissions(
    @Param('id') id: string,
    @Body() updatedPermissions: UpdatePermissionDto[],
  ) {
    return this.permissionsService.editPermissions(id, updatedPermissions);
  }
}
