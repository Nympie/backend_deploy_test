import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { FilesService } from './files.service';
import { FileUpload, GraphQlUpload } from 'graphql-upload';

@Resolver()
export class FilesResolver {
  constructor(
    private readonly filesService: FilesService, //
  ) {}

  @Mutation(() => String)
  uploadFile(
    @Args({ name: 'file', type: () => GraphQlUpload }) file: FileUpload,
  ): string {
    return this.filesService.upload({ file });
  }
}
