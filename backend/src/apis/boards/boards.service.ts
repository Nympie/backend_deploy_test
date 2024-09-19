import { Injectable, Scope } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { IBoardsServiceCreate } from './interfaces/boards_service.interface';

// injection scope를 통해 singleton으로 변경 가능
// DEFAULT == singleton
// REQUEST == instance
@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
  findAll(): Board[] {
    const result = [
      {
        id: '1',
        writer: 'writer1',
        title: 'title1',
        content: 'content1',
      },
      {
        id: '2',
        writer: 'writer2',
        title: 'title2',
        content: 'content2',
      },
      {
        id: '3',
        writer: 'writer3',
        title: 'title3',
        content: 'content3',
      },
    ];

    return result;
  }

  create({ createBoardInput }: IBoardsServiceCreate): string {
    console.log(createBoardInput.writer);
    console.log(createBoardInput.title);
    console.log(createBoardInput.content);

    return '게시물 등록 성공';
  }
}
