import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@ObjectType()
@Entity("Users")
export class User extends BaseEntity {

  @Field(type => ID, { nullable: false })
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ nullable: false })
  @Column()
  firstName!: string;

  @Column()
  @Field()
  lastName!: string;

  @Field({ nullable: false })
  @Column()
  age!: number;

  @Field({ nullable: false })
  @CreateDateColumn()
  createdDate!: Date;

  @Field({ nullable: false })
  @UpdateDateColumn()
  updatedDate!: Date;
}
