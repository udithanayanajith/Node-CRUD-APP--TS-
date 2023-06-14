import mongooseDB, { Schema } from "mongoose";
interface drugI extends Document {
  gName: string;
  dBrand: string;
}

const drugSchema: Schema = new Schema({
  gName: { type: String, required: true },
  dBrand: { type: String, required: true },
});

const DrugModel = mongooseDB.model<drugI>("drug", drugSchema);
export default DrugModel;
