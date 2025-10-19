import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SMES } from './smes.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  user_id: number;

  @ManyToOne(() => SMES, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: SMES;

  @Column({ length: 32 })
  platform: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ 
    length: 20, 
    default: 'published',
    type: 'varchar'
  })
  status: 'published' | 'scheduled' | 'draft' | 'failed';

  @Column({ length: 255, nullable: true })
  platform_post_id: string;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduled_at: Date;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 
