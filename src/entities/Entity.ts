import {
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

import { classToPlain, Exclude } from "class-transformer"

export default abstract class Entity extends BaseEntity {
  @Exclude() //exlcude from response
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  toJSON() {
    return classToPlain(this) //makes exlude() and transformer work
  }
}
