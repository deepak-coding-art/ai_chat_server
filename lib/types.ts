export interface Chat {
  id: string;
  title: string | null;
  created_by: string;
  created_at: string;
  is_public: boolean;
}

export interface ChatTask {
  title: string;
  icon: string;
  prompt: string;
}
