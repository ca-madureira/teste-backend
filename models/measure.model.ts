import mongoose, { Schema, Model, Document } from 'mongoose';

interface IMeasure extends Document {
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  confirmed_value: number;
  image: string;
}

const measureSchema = new Schema<IMeasure>({
  measure_datetime: { type: Date },
  measure_type: { type: String, required: true },
  has_confirmed: { type: Boolean, default: false },
  confirmed_value: { type: Number },
  image: { type: String, required: true },
});

export const Measure: Model<IMeasure> = mongoose.model<IMeasure>(
  'Measure',
  measureSchema,
);
