export const vehicleMakes = {
  car: [
    'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Honda', 'Kia',
    'Renault', 'Nissan', 'Skoda', 'Volkswagen', 'MG', 'Citroen', 'Ford',
    'Chevrolet', 'Fiat', 'Jeep', 'Isuzu', 'BMW', 'Mercedes-Benz', 'Audi',
    'Volvo', 'Land Rover', 'Lexus', 'Porsche', 'BYD', 'Force Motors', 'Other',
  ],
  truck: [
    'Tata', 'Ashok Leyland', 'BharatBenz', 'Eicher', 'Mahindra', 'Force Motors',
    'Isuzu', 'Volvo', 'Scania', 'MAN', 'SML Isuzu', 'Piaggio', 'Other',
  ],
  tractor: [
    'Mahindra', 'Swaraj', 'Sonalika', 'John Deere', 'TAFE', 'Massey Ferguson',
    'Eicher', 'New Holland', 'Farmtrac', 'Powertrac', 'Deutz-Fahr', 'Kubota',
    'Force Balwan', 'VST', 'Preet', 'Indo Farm', 'ACE', 'Other',
  ],
}

export const vehicleYears = Array.from(
  { length: new Date().getFullYear() - 1989 },
  (_, index) => String(new Date().getFullYear() - index),
)
