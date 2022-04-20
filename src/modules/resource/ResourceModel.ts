import { prop, getModelForClass } from '@typegoose/typegoose';

export class Resource {
  @prop({ required: true, select: false })
  public cloudinary_id!: string;

  @prop({ required: true })
  public secure_url!: string;
}

const ResourceModel = getModelForClass(Resource, {
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
});

export default ResourceModel;
