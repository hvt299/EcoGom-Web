export interface Location {
  _id: string;
  name: string;
  type: string;
  address_hint: string;
  phone_number: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [Longitude, Latitude] - [Kinh độ, Vĩ độ]
  };
  accepted_items: string[];
}