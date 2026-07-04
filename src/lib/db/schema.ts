import { sql } from 'drizzle-orm'
import {
  check,
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { authUsers } from 'drizzle-orm/supabase'

// Schema is the source of truth: edit here -> pnpm db:generate -> pnpm db:migrate.
// Constraint/index names match what the original supabase CLI migrations created,
// so generated SQL stays compatible with the prod database.

export const goals = pgTable(
  'goals',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    totalItems: integer('total_items').notNull(),
    durationValue: integer('duration_value').notNull(),
    durationUnit: text('duration_unit', { enum: ['week', 'month'] })
      .notNull()
      .default('month'),
    startDate: timestamp('start_date', { withTimezone: true })
      .notNull()
      .defaultNow(),
    endDate: timestamp('end_date', { withTimezone: true }).notNull(),
    status: text('status', { enum: ['active', 'completed', 'reviewing'] })
      .notNull()
      .default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [authUsers.id],
      name: 'goals_user_id_fkey',
    }),
    index('goals_user_id_idx').on(table.userId),
    index('goals_status_idx').on(table.status),
    check(
      'goals_total_items_check',
      sql`${table.totalItems} >= 1 and ${table.totalItems} <= 100`,
    ),
    check(
      'goals_status_check',
      sql`${table.status} in ('active', 'completed', 'reviewing')`,
    ),
    check(
      'goals_duration_unit_check',
      sql`${table.durationUnit} in ('week', 'month')`,
    ),
    check(
      'goals_duration_value_check',
      sql`(${table.durationUnit} = 'week' and ${table.durationValue} between 1 and 52) or (${table.durationUnit} = 'month' and ${table.durationValue} between 1 and 12)`,
    ),
  ],
)

export const debits = pgTable(
  'debits',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    goalId: uuid('goal_id').notNull(),
    userId: uuid('user_id').notNull(),
    foodName: text('food_name').notNull(),
    notes: text('notes'),
    debitedAt: timestamp('debited_at', { withTimezone: true }).defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.goalId],
      foreignColumns: [goals.id],
      name: 'debits_goal_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [authUsers.id],
      name: 'debits_user_id_fkey',
    }),
    index('debits_goal_id_idx').on(table.goalId),
    index('debits_user_id_idx').on(table.userId),
    check(
      'debits_notes_check',
      sql`${table.notes} is null or char_length(${table.notes}) <= 250`,
    ),
  ],
)

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey(),
    displayName: text('display_name'),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [authUsers.id],
      name: 'profiles_id_fkey',
    }).onDelete('cascade'),
  ],
)

export type Goal = typeof goals.$inferSelect
export type NewGoal = typeof goals.$inferInsert
export type Debit = typeof debits.$inferSelect
export type NewDebit = typeof debits.$inferInsert
export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
