import { isRight, left, Either } from "fp-ts/Either";
import { TaskEither } from "fp-ts/TaskEither";

const INTERNAL_THROW = Symbol("INTERNAL_THROW");

interface TaskAsyncHelper<E, A> {
  fromTaskEither(taskEither: TaskEither<E, A>): Promise<A>;
  fromPromise(promise: Promise<Either<E, A>>): Promise<A>;
}

/**
 * Create a type safe async function.
 *
 * @example
 *
 *   const getData (id: string): TaskEither<E, A> {
 *     // ...
 *   }
 *
 *   TaskAsync(async ({fromTaskEither})=>{
 *     const value = await fromTaskEither(getData("1"))
 *     return right(value);
 *   })();
 *
 */
export function TaskAsync<E, A>(
  fn: (helpers: TaskAsyncHelper<E, A>) => Promise<Either<E, A>>
): TaskEither<E, A> {
  async function fromPromise<E, A>(promise: Promise<Either<E, A>>): Promise<A> {
    const either = await promise;
    return isRight(either) ? either.right : throwTaggedLeft(either.left);
  }

  function fromTaskEither<E, A>(taskEither: TaskEither<E, A>) {
    return fromPromise(taskEither());
  }

  const helpers: TaskAsyncHelper<E, A> = {
    fromPromise,
    fromTaskEither,
  };

  return () =>
    fn(helpers).catch((e) =>
      e.INTERNAL_THROW === INTERNAL_THROW ? left(e.err) : Promise.reject(e)
    );
}

function throwTaggedLeft<E>(err: E): never {
  throw { INTERNAL_THROW, err };
}
