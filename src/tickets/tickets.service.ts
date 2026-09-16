import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketsService {
  private readonly tickets = [
    { id: 1, subject: 'Cannot login' },
    { id: 2, subject: 'Payment failed' },
  ];

  findAll() {
    return this.tickets;
  }
}
