
import { ReactNode } from 'react';

export interface ServiceType {
  id: string;
  title: string;
  icon: ReactNode;
  image: string;
  description: string;
  details: string[];
}
