import { Injectable } from '@nestjs/common';
import { Client } from 'whatsapp-web.js';

@Injectable()
export class ChatService {
  private sessions: Map<string, Client> = new Map();

  async sendMessage(
    sessionId: string,
    number: string,
    message: string,
  ): Promise<void> {
    const client = this.sessions.get(sessionId);
    if (!client) {
      throw new Error(`Session with id ${sessionId} not found`);
    }
    await client.sendMessage(number, message);
  }

  addSession(sessionId: string, client: Client): void {
    this.sessions.set(sessionId, client);
  }

  removeSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  async getChats(sessionId: string): Promise<any> {
    const client = this.sessions.get(sessionId);
    if (!client) {
      throw new Error(`Session with id ${sessionId} not found`);
    }
    return await client.getChats();
  }
}
