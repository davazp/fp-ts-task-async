import { left, right, Either } from "fp-ts/Either";
import { TaskAsync } from "./TaskAsync";

describe("TaskAsync", () => {
  test("returns (lazily) a promise that rejects if the parameter throws", () => {
    const err = new Error("test");

    const f = TaskAsync(async () => {
      throw err;
    });

    expect(f).rejects.toBe(err);
  });

  test("rejects if fromPromise argument promise rejects", () => {
    const err = new Error("test");

    const fail = async (): Promise<Either<boolean, number>> => {
      throw err;
    };

    const f = TaskAsync(async ({ fromPromise }) => {
      await fromPromise(fail());
      return right(5);
    });

    expect(f).rejects.toBe(err);
  });

  test("resolves to a left fromPromise returns a left", () => {
    const fail = async (): Promise<Either<boolean, number>> => {
      return left(true);
    };

    const f = TaskAsync(async ({ fromPromise }) => {
      await fromPromise(fail());
      return right(5);
    });

    expect(f()).resolves.toEqual(left(true));
  });

  test("execution is aborted if fromPromise's argument is rejected", () => {
    const fail = async (): Promise<Either<boolean, number>> => {
      return left(true);
    };

    const fn = jest.fn();

    const f = TaskAsync(async ({ fromPromise }) => {
      await fromPromise(fail());
      fn();
      return right(5);
    });

    f();

    expect(fn).not.toBeCalled();
  });
});
