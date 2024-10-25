import { Injectable } from '@nestjs/common';
import { relative, join } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  async updateDogImage(id: number, imagePath: string) {
    // busca pela imagem atual do cachorro
    const dog = await this.prisma.dog.findUnique({
      where: { id },
      select: { dogImage: true }, // Obtém apenas o campo de imagem
    });

    // Se houver uma imagem atual, remove do sistema de arquivos
    if (dog && dog.dogImage) {
      const oldImagePath = join(__dirname, '..', '..', '..', dog.dogImage);
      this.deleteOldImage(oldImagePath);
    }

    // Converte o caminho absoluto para um relativo, a ser armazenado no banco
    const relativePath = relative(join(__dirname, '..', '..', '..'), imagePath);

    // Atualiza a entrada no banco de dados com o novo caminho da imagem
    return this.prisma.dog.update({
      where: { id },
      data: { dogImage: relativePath },
    });
  }

  // Função para deletar o arquivo de imagem anterior
  private deleteOldImage(imagePath: string) {
    // Verifica se o arquivo existe antes de tentar excluir
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Erro ao excluir a imagem: ${imagePath}`, err);
        } else {
          console.log(`Imagem antiga excluída: ${imagePath}`);
        }
      });
    }
  }

  async uploadDogBreedImage(id: number, imagePath: string) {
    // busca pela imagem atual da raça de cachorro
    const dogBreed = await this.prisma.dogBreed.findUnique({
      where: { id },
      select: { image: true }, // Obtém apenas o campo de imagem
    });

    // Se houver uma imagem atual, remove do sistema de arquivos
    if (dogBreed && dogBreed.image) {
      const oldImagePath = join(__dirname, '..', '..', '..', dogBreed.image);
      this.deleteOldImage(oldImagePath);
    }

    // Converte o caminho absoluto para um relativo, a ser armazenado no banco
    const relativePath = relative(join(__dirname, '..', '..', '..'), imagePath);

    // Atualiza a entrada no banco de dados com o novo caminho da imagem
    return this.prisma.dogBreed.update({
      where: { id },
      data: { image: relativePath },
    });
  }
}
