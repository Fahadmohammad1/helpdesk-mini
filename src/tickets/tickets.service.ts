import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { Ticket } from './ticket.interface.js';

@Injectable()
export class TicketsService {
  private readonly tickets: Ticket[] = [
    {
      id: 1,
      subject: 'Cannot login to account',
      description: 'User cannot access the dashboard after login',
      priority: 'high',
      status: 'open',
      createdAt: '2026-09-01T10:00:000Z',
    },
    {
      id: 2,
      subject: 'Payment failed',
      description: 'Card payment fails at the checkout step',
      priority: 'medium',
      status: 'open',
      createdAt: '2026-09-01T11:30:000Z',
    },
    {
      id: 3,
      subject: 'Invoice download not working',
      description: 'Invoice PDF download returns an empty file',
      priority: 'low',
      status: 'closed',
      createdAt: '2026-09-01T12:45:000Z',
    },
  ];
  private nextTicketId = 4;

  findAll(status?: Ticket['status'], priority?: Ticket['priority']) {
    let tickets = this.tickets;

    if (status) {
      tickets = tickets.filter((ticket) => ticket.status === status);
    }

    if (priority) {
      tickets = tickets.filter((ticket) => ticket.priority === priority);
    }

    return tickets;
  }

  findOne(id: number) {
    const ticket = this.tickets.find((ticket) => ticket.id === id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  create(createTicketDto: CreateTicketDto) {
    const newTicket: Ticket = {
      id: this.nextTicketId++,
      status: 'open',
      createdAt: new Date().toISOString(),
      ...createTicketDto,
    };

    this.tickets.push(newTicket);

    return newTicket;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = this.findOne(id);

    if (ticket.status === 'closed') {
      throw new BadRequestException(
        `Cannot update a closed ticket with ID ${id}`,
      );
    }

    Object.assign(ticket, updateTicketDto);

    return ticket;
  }

  closeTicket(id: number) {
    const ticket = this.findOne(id);

    if (ticket.status === 'closed') {
      throw new BadRequestException(`Ticket with ID ${id} is already closed`);
    }

    ticket.status = 'closed';

    return ticket;
  }
}
