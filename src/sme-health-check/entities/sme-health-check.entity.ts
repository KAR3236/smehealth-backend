import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { smeHealthCheckImages } from './sme-health-check-images.entity';

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

  @OneToMany(
    () => smeHealthCheckImages,
    (smeHealthCheckImages) => smeHealthCheckImages.smeHealthCheck,
  )
  smeHealthCheckImages: smeHealthCheckImages[];
}
