import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private httpService: HttpService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    const data = JSON.parse(
      '{"fullName":"Pancake strawberry","shortName":"Pancake","price":1,"category":"DESSERT","image":"/assets/images/pancake.jpg"}',
    );
    const response = await lastValueFrom(
      this.httpService.post('http://localhost:3000/menus', data),
    );
    console.log(response);
  }
}
