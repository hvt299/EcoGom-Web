export interface ProcessingStep {
  step_order: number;
  content: string;
}

export interface Waste {
  _id: string;
  name: string;
  local_names: string[];
  category: 
    | "Chất thải thực phẩm" 
    | "Chất thải rắn có khả năng tái sử dụng, tái chế" 
    | "Chất thải rắn sinh hoạt khác" 
    | string;
  unit: string;
  estimated_price: number;
  images: string[];
  processing_steps: ProcessingStep[];
  is_active: boolean;
}