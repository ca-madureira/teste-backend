import mongoose, { Model, Schema, Document } from 'mongoose';

export interface ITemporaryImage extends Document {
  imageData: string;
  expirationDate: Date;
}

const temporaryImageSchema = new Schema<ITemporaryImage>({
  imageData: { type: String, required: true },
  expirationDate: { type: Date, required: true, index: { expires: '1h' } },
});

export const TemporaryImage: Model<ITemporaryImage> =
  mongoose.model<ITemporaryImage>('TemporaryImage', temporaryImageSchema);
