import { isRight, left, Either } from "fp-ts/Either";
import { TaskEither } from "fp-ts/TaskEither";

const INTERNAL_THROW = Symbol("INTERNAL_THROW");

/**
 * Create a type safe async function.
 *
 * @example
 *
 *   const getData (id: string): TaskEither<E, A> {
 *     // ...
 *   }
 *
 *   TaskAsync(async ()=>{
 *     const value = await fromPromise(getData("1"))
 *     return value;
 *   })();
 *
 */
export function TaskAsync<E, A>(
  taskEither: TaskEither<E, A>
): TaskEither<E, A> {
  return () =>
    taskEither().catch((err) =>
      err.INTERNAL_THROW === INTERNAL_THROW
        ? left(err.value)
        : Promise.reject(err)
    );
}

export async function fromPromise<E, A>(
  promise: Promise<Either<E, A>>
): Promise<A> {
  const either = await promise;
  return isRight(either) ? either.right : throwTaggedLeft(either.left);
}

function throwTaggedLeft<E>(err: E): never {
  throw { INTERNAL_THROW, err };
}

export function fromTaskEither<E, A>(taskEither: TaskEither<E, A>) {
  return fromPromise(taskEither());
}
