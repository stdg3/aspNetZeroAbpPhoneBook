expect.extend({
  async toHaveNoChanges(params: Error | Success): Promise<MatchError | MatchSuccess> {
    if (isError(params)) return new MatchError(`Diff detected on ${params.paths.diff}`, params.paths);
    return new MatchSuccess(`Success: ${params.name} has no change.`);
  },
});

export class MatchError {
  public pass = false as const;

  public message: () => string;

  constructor(message: string, public paths: Paths) {
    this.message = () => message;
  }
}

export class MatchSuccess {
  public pass = true as const;

  public message: () => string;

  constructor(message: string) {
    this.message = () => message;
  }
}

function isError(params: Success): params is Error {
  return Boolean(params.diff);
}

interface Error extends Success {
  paths: Paths;
}

interface Success {
  diff: number;
  name: string;
}

export interface Paths {
  approved: string;
  current: string;
  diff: string;
}
