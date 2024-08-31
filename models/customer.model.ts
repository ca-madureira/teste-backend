import mongoose, { Schema, Model, Document } from 'mongoose';

interface ICustomer extends Document {
  customer_code: string;
  measures: mongoose.Types.ObjectId[];
}

const customerSchema = new Schema<ICustomer>({
  customer_code: { type: String, required: true },
  measures: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Measure',
    },
  ],
});

export const Customer: Model<ICustomer> = mongoose.model<ICustomer>(
  'Customer',
  customerSchema,
);
