import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { IFilesServiceUpload } from './interfaces/files-service.interface';

@Injectable()
export class FilesService {
  upload({ file }: IFilesServiceUpload): string {
    // 1. 클라우드 스토리지에 파일 저장
    // 1-1) 스토리지 세팅
    const storage = new Storage({
      projectId: 'backendtest-435814',
      keyFilename: 'gcp-storage-file.json',
    }).bucket('code-camp-backend');

    // 1-2) 스토리지에 파일 업로드
    file
      .createReadStream()
      .pipe(storage.file(file.filename).createWriteStream())
      .on('finish', () => {
        console.log('성공');
      })
      .on('error', () => {
        console.log('실패');
      });

    console.log('파일 전송이 완료되었습니다.');
    return '끝!';
  }
}
