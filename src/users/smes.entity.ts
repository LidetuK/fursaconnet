import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('smes')
export class SMES {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  company_name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  company_logo: string;

  @Column({ nullable: true })
  linkedinAccessToken: string;

  @Column({ nullable: true })
  linkedinRefreshToken: string;

  @Column({ nullable: true, type: 'bigint' })
  linkedinTokenExpiresAt: number | null;

  @Column({ nullable: true })
  linkedinUserId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
} 
