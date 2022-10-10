declare global {
  const projects: Env.Projects;
  const timestamp: number;

  interface Package {
    name: string;
    repository: {
      type: string;
      url: string;
    };
    version: string;
  }

  namespace Env {
    interface GitHub {
      defaultBranch: string;
      remoteName: string;
      repo: string;
      token: string;
    }

    type Projects = Record<string, Env.Project>;

    interface Project {
      name: string;
      labels: string[];
      owners: string[];
      repo: string;
      path: string;
      urlApp: string;
      auth: Auth;
    }

    interface Auth {
      pass: string;
      user: string;
      url?: string;
    }
  }
}

export {};
