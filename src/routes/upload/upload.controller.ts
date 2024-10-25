import {
  Controller,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../services/multer.config';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Patch('dog/:id')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async updateDogImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file.path;
    console.log('imagePath:', imagePath);
    console.log(file);
    return this.uploadService.updateDogImage(+id, imagePath);
  }

  @Patch('dogbreed/:id')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadDogBreedImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file.path;
    console.log('imagePath:', imagePath);
    console.log(file);
    return this.uploadService.uploadDogBreedImage(+id, imagePath);
  }
}
