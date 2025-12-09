import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { GetContactsQueryDto } from './dto/get-contacts-query.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll(@Query() query: GetContactsQueryDto) {
    return this.contactsService.getMessages(query);
  }

  @Post()
  async create(@Body() body: CreateContactDto) {
    return this.contactsService.createMessage(body);
  }
}
