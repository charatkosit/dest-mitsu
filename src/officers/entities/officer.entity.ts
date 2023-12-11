import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Officer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({nullable:true})
  address: string;

  @Column()
  phone: string;

  @Column({nullable:true})
  idOfficer: string;

  @Column({nullable:true})
  department: string;

  @Column()
  token: string;

  @Column()
  multiSelectFloor: string;





}
