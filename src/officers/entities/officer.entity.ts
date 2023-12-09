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
  phoneExt: string;

  @Column({nullable:true})
  department: string;

  @Column({nullable:true})
  idOfficer: string;

  @Column()
  token: string;

  @Column()
  idCard: string;

  @Column()
  destFloor: number;

  @Column({nullable:true})
  remarks: string;




}
