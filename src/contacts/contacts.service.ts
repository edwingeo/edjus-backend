import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(input: CreateContactDto) {
    return this.prisma.contactMessage.create({
      data: input,
    });
  }
}
