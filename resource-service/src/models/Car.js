import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1900, max: 2100 },
    color: { type: String, trim: true, default: '' },
    fuelType: { type: String, trim: true, default: '' },        // Gasolina, Flex, Diesel...
    transmission: { type: String, trim: true, default: '' },    // Manual, Automático
    doors: { type: Number, default: null },
    mileage: { type: Number, default: null },                   // quilometragem (km)
    price: { type: Number, default: null },                     // preço (R$)
    owner: { type: String, required: true },                    // id do usuário dono (RF3)
  },
  { timestamps: true }
);

export const Car = mongoose.model('Car', carSchema);
