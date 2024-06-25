import { CanActivate, ExecutionContext, Injectable, Inject, BadRequestException } from "@nestjs/common";
import { TagRepository } from "../tag.repository";

@Injectable()
export class TagGuard implements CanActivate {
  
  constructor(
    @Inject(TagRepository) private readonly tagRepository: TagRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const { name } = request.body;

    if (!name) {
      throw new BadRequestException('Tag name is required');
    }

    const tagExists = await this.tagRepository.findByName(parseInt(request["user"].sub), name);

    if (tagExists) {
      throw new BadRequestException(`Tag with name "${name}" already exists`);
    }

    return true;
  }
}
