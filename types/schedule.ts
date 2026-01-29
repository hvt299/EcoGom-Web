export interface ScheduleResponse {
  type: 'SPECIAL' | 'STANDARD' | 'NONE';
  message: string;
  is_cancelled: boolean;
  time?: string;
  waste_type?: string;
  note?: string;
}

export interface StandardScheduleItem {
  day_of_week: number;
  time_slot: string;
  waste_type: string;
}

export interface SpecialEvent {
  name: string;
  start_date: string;
  end_date: string;
  is_cancelled: boolean;
  alternate_time?: string;
  note?: string;
}

export interface Schedule {
  _id: string;
  village_name: string;
  ward: string;
  standard_schedule: StandardScheduleItem[];
  special_events: SpecialEvent[];
}