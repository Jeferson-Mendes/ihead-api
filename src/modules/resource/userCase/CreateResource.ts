import ResourceModel, { Resource } from '@modules/resource/ResourceModel';

interface IRequest {
  cloudinary_id: string;
  secure_url: string;
}

class CreateResource {
  public async execute({
    cloudinary_id,
    secure_url,
  }: IRequest): Promise<Resource> {
    const resource = await ResourceModel.create({
      cloudinary_id,
      secure_url,
    });

    return resource;
  }
}

export default CreateResource;
