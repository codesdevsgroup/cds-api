import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService } from './whatsapp.service';
import { Client } from 'whatsapp-web.js';

jest.mock('whatsapp-web.js');

describe('WhatsappService', () => {
  let service: WhatsappService;
  let clientMock: jest.Mocked<Client>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatsappService],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
    clientMock = Client as jest.Mocked<Client>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a message', async () => {
    const to = '5533991448945';
    const message = 'Hello, this is a test message';
    clientMock.prototype.sendMessage.mockResolvedValueOnce(undefined);

    await expect(service.sendMessage(to, message)).resolves.not.toThrow();
    expect(clientMock.prototype.sendMessage).toHaveBeenCalledWith(
      `+${to}`,
      message,
    );
  });

  it('should throw an error for invalid phone number format', async () => {
    const to = 'invalid_number';
    const message = 'Hello, this is a test message';

    await expect(service.sendMessage(to, message)).rejects.toThrow(
      'Invalid phone number format',
    );
  });
});
