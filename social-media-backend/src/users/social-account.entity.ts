import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { SMES } from './smes.entity';

@Entity('social_accounts')
@Unique(['user_id', 'platform'])
export class SocialAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  user_id: number;

  @ManyToOne(() => SMES, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: SMES;

  @Column({ length: 32 })
  platform: string;

  @Column({ type: 'text', nullable: true })
  access_token: string;

  @Column({ type: 'text', nullable: true })
  token_secret: string;

  @Column({ type: 'text', nullable: true })
  refresh_token: string;

  @Column({ length: 128, nullable: true })
  platform_user_id: string;

  @Column({ length: 128, nullable: true })
  screen_name: string;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 