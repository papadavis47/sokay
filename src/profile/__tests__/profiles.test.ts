import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isRedirect } from '@tanstack/react-router'
import { callServerFn, createDbMock, createSupabaseMock } from '@/test/helpers'

let supabaseMock: ReturnType<typeof createSupabaseMock>
let dbMock: ReturnType<typeof createDbMock>

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => supabaseMock,
}))
vi.mock('@/lib/db', () => ({
  get db() {
    return dbMock.db
  },
}))

const USER = { id: 'user-1' }
const PROFILE = { id: USER.id, displayName: 'Ada', avatarUrl: null }

const { getProfile, updateProfile, updateAvatar } =
  await import('@/profile/profiles')

beforeEach(() => {
  supabaseMock = createSupabaseMock(USER)
  dbMock = createDbMock()
})

describe('getProfile', () => {
  it('redirects to /login when unauthenticated', async () => {
    supabaseMock = createSupabaseMock(null)
    try {
      await callServerFn(() => getProfile())
      expect.unreachable('should have thrown a redirect')
    } catch (err) {
      expect(isRedirect(err)).toBe(true)
    }
  })

  it('queries the profile scoped to the user', async () => {
    dbMock = createDbMock([[PROFILE]])
    await callServerFn(() => getProfile())
    expect(dbMock.db.select).toHaveBeenCalledOnce()
    expect(dbMock.builders[0].where).toHaveBeenCalledOnce()
    expect(dbMock.builders[0].calls.limit).toBe(1)
  })
})

describe('updateProfile', () => {
  it('redirects to /login when unauthenticated', async () => {
    supabaseMock = createSupabaseMock(null)
    try {
      await callServerFn(() => updateProfile({ data: { displayName: 'Ada' } }))
      expect.unreachable('should have thrown a redirect')
    } catch (err) {
      expect(isRedirect(err)).toBe(true)
    }
  })

  it('rejects an empty display name', async () => {
    await expect(
      callServerFn(() => updateProfile({ data: { displayName: '   ' } })),
    ).rejects.toThrow('between 1 and 80 characters')
  })

  it('rejects a display name longer than 80 characters', async () => {
    await expect(
      callServerFn(() =>
        updateProfile({ data: { displayName: 'x'.repeat(81) } }),
      ),
    ).rejects.toThrow('between 1 and 80 characters')
  })

  it('trims and saves a valid display name', async () => {
    dbMock = createDbMock([undefined])
    await callServerFn(() =>
      updateProfile({ data: { displayName: '  Ada Lovelace  ' } }),
    )
    expect(dbMock.db.update).toHaveBeenCalledOnce()
    expect(dbMock.builders[0].calls.set).toEqual({
      displayName: 'Ada Lovelace',
    })
  })
})

describe('updateAvatar', () => {
  it('redirects to /login when unauthenticated', async () => {
    supabaseMock = createSupabaseMock(null)
    try {
      await callServerFn(() =>
        updateAvatar({ data: { avatarUrl: 'https://x/y.png' } }),
      )
      expect.unreachable('should have thrown a redirect')
    } catch (err) {
      expect(isRedirect(err)).toBe(true)
    }
  })

  it('saves the avatar url', async () => {
    dbMock = createDbMock([undefined])
    await callServerFn(() =>
      updateAvatar({ data: { avatarUrl: 'https://x/y.png' } }),
    )
    expect(dbMock.builders[0].calls.set).toEqual({
      avatarUrl: 'https://x/y.png',
    })
  })

  it('clears the avatar url when passed null', async () => {
    dbMock = createDbMock([undefined])
    await callServerFn(() => updateAvatar({ data: { avatarUrl: null } }))
    expect(dbMock.builders[0].calls.set).toEqual({ avatarUrl: null })
  })
})
