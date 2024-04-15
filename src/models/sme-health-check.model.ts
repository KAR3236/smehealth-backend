import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class smeHealthCheck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_uen: string;

  @Column()
  company_name: string;

  @Column()
  full_name: string;

  @Column()
  company_position: string;

  @Column({ unique: true })
  email: string;

  @Column()
  mobile_no: string;

  @Column()
  file: string;

  @Column({ default: true })
  isActive: boolean;
}
