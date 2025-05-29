export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  created_at: bigint;
  updated_at: bigint;
}

export interface Slide {
  id: string;
  content: string;
  notes: string;
  order: number;
}
