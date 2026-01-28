export interface ProcessingStep {
  step_order: number;
  content: string;
}

export interface Waste {
  _id: string;
  name: string;
  local_names: string[];
  category: string;
  estimated_price: string;
  images: string[];
  processing_steps: ProcessingStep[];
  is_active: boolean;
}