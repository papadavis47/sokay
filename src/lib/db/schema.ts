import { pgTable, uuid, integer, text, timestamp } from 'drizzle-orm/pg-core'

export const goals = pgTable('goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  totalItems: integer('total_items').notNull(),
  durationMonths: integer('duration_months').notNull(),
  startDate: timestamp('start_date', { withTimezone: true })
    .notNull()
    .defaultNow(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  status: text('status', { enum: ['active', 'completed', 'reviewing'] })
    .notNull()
    .default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const debits = pgTable('debits', {
  id: uuid('id').defaultRandom().primaryKey(),
  goalId: uuid('goal_id')
    .notNull()
    .references(() => goals.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  foodName: text('food_name').notNull(),
  notes: text('notes'),
  debitedAt: timestamp('debited_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export type Goal = typeof goals.$inferSelect
export type NewGoal = typeof goals.$inferInsert
export type Debit = typeof debits.$inferSelect
export type NewDebit = typeof debits.$inferInsert
export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
