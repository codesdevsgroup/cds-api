import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionDto {
  @ApiProperty({ description: 'The interface name for the permission' })
  @IsString()
  interface: string;

  @ApiProperty({ description: 'Permission to view' })
  @IsBoolean()
  view: boolean;

  @ApiProperty({ description: 'Permission to add' })
  @IsBoolean()
  add: boolean;

  @ApiProperty({ description: 'Permission to edit' })
  @IsBoolean()
  edit: boolean;

  @ApiProperty({ description: 'Permission to delete' })
  @IsBoolean()
  delete: boolean;
}