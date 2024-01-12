import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Visitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column({ type: 'varchar', default: 'normal' })
  callAttribute: string;

  @Column()
  token: string;

  @Column()
  idCard: string;

  @Column()
  destFloor: number;

  @Column({nullable:true})
  checkIn: Date;

  @Column({nullable:true})
  checkOut: Date;


}
