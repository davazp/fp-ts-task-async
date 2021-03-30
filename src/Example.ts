import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import {pipe} from 'fp-ts/Function'
import { TaskAsync } from './TaskAsync'

const returnLeft: TE.TaskEither<boolean, number> = TE.left(true)
const returnRight: TE.TaskEither<string, number> = TE.right(10)

// const result1: TaskEither<string | boolean, number>
const result1 = pipe(
  returnLeft,
  TE.chainW((a) =>
    pipe(
      returnRight,
      TE.map((b) => a + b)
    )
  )
)

// const result2: TaskEither<unknown, unknown>
const result2 = TaskAsync(async ({fromTaskEither}) => {
  const a = await fromTaskEither(returnLeft)
  const b = await fromTaskEither(returnRight)

  return E.right(a + b)
})


// const result3: TaskEither<never, number>
const result3 = TaskAsync<string | boolean, number>(async ({ fromTaskEither }) => {
  const a = await fromTaskEither(returnLeft)
  const b = await fromTaskEither(returnRight)
  return E.right(a + b)
})

// FAILS TO TYPE CHECK
const result4 = TaskAsync<string, number>(async ({ fromTaskEither }) => {
  const a = await fromTaskEither(returnLeft)
  const b = await fromTaskEither(returnRight)
  return E.right(a + b)
})
