import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  linkedinAccessToken: string;

  @Column({ nullable: true })
  linkedinRefreshToken: string;

  @Column({ nullable: true, type: 'bigint' })
  linkedinTokenExpiresAt: number | null;

  @Column({ nullable: true })
  linkedinUserId: string;
} 