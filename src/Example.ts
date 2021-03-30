import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { fromTaskEither, TaskAsync } from "./TaskAsync";

const fns: Record<string, TE.TaskEither < boolean, number>> = {
  returnLeft: TE.left(true),
  returnRight: TE.right(10),
  getRejection: () => { throw 'error' }
}


function runTask(id: string) {
  return TaskAsync<boolean, number>(async () => {

    // value is a _number_, the extracted right
    const value = await fromTaskEither(fns[id]);

    // ejecution does NOT get here if getData resolves to a Left.
    console.log("DOES NOT HAPPEN");

    return E.right(value);
  })();
}



async function main() {

  console.log('Example of a TaskAsync interrupted by a left. Note that console.log from task does not happen.')
  runTask('returnLeft')
    .then((either) => {
      console.log({either})
    })
    .catch((err) => {
      console.log({err})
    });


  console.log('Example of a TaskAsync working. Note that console.log from task does not happen.')
  runTask('returnRight')
    .then((either) => {
      console.log({either})
    })
    .catch((err) => {
      console.log({err})
    });


  console.log('Example of unhandled promise')
  runTask('getRejection')
    .then((either) => {
      console.log({ either })
    })
    .catch((err) => {
      console.log({err})
    });

}


main()
