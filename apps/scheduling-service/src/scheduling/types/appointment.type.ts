type Appointment = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  provider_id: number;
  customer_id: number;
};

export default Appointment;
