import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { smeHealthCheck } from './sme-health-check.entity';

@Entity()
export class smeHealthCheckImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  smeHealthCheckId: number;

  @Column()
  file: string;

  @ManyToOne(
    () => smeHealthCheck,
    (smeHealthCheck) => smeHealthCheck.smeHealthCheckImages,
  )
  smeHealthCheck: smeHealthCheck;
}
