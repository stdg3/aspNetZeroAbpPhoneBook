const { env } = process;
const envFile = env.TEST_ENV ? `.env.${env.TEST_ENV}` : '.env';
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({
  path: envFile,
});
const _ = require('lodash');
const playwright = require('playwright');
const packageJson = require('./package.json');
const { DefaultBranchAssigner } = require('./jest/branches');
const { DefaultErrorCollector } = require('./jest/errors');
const { DefaultIssueGenerator } = require('./jest/issues');
const { DefaultMergeInitiator } = require('./jest/merges');

const isProdMode = env.NODE_ENV === 'production';
const isHeadless = isProdMode || env.HEADFUL === undefined || env.HEADFUL == 'true';

const github = resolveGitHub(env);
const projects = resolveProjects(env);
const reporters = isProdMode
  ? [
      'default',
      [
        '<rootDir>/jest/reporters.js',
        {
          errorCollector: new DefaultErrorCollector(projects),
          branchAssigner: new DefaultBranchAssigner(github),
          mergeInitiator: new DefaultMergeInitiator(github, packageJson),
          issueGenerator: new DefaultIssueGenerator(github, packageJson),
        },
      ],
    ]
  : ['default'];

module.exports = {
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js', '<rootDir>/jest/matchers.js'],
  testSequencer: '<rootDir>/jest/sequencer.js',
  globals: { projects, timestamp: new Date().valueOf() },
  preset: 'jest-playwright-preset',
  reporters,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testTimeout: 120000,
  testEnvironmentOptions: {
    'jest-playwright': {
      launchOptions: {
        headless: isHeadless,
      },
      contextOptions: {
        ignoreHTTPSErrors: true,
      },
      devices: [
        {
          name: 'desktop',
          userAgent:
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
          viewport: {
            width: 1920,
            height: 1080,
          },
          deviceScaleFactor: 1,
          isMobile: false,
          hasTouch: false,
          defaultBrowserType: 'chrome',
        },
        // {
        //   name: 'tablet',
        //   ...playwright.devices['iPad Mini'],
        // },
        // {
        //   name: 'phone',
        //   ...playwright.devices['Pixel 2'],
        // },
      ],
    },
  },
};

function resolveGitHub(vars) {
  return {
    defaultBranch: vars.GITHUB_DEFAULT_BRANCH || 'master',
    remoteName: vars.GITHUB_REMOTE_NAME || 'origin',
    repo: (vars.GITHUB_REPO || '').split('/').splice(-2).join('/'),
    token: vars.GITHUB_TOKEN,
  };
}

function resolveProjects(vars) {
  return Object.entries(vars)
    .filter(([key]) => key && /^[0-9]+__/.test(key))
    .reduce((acc, [key, value]) => {
      const [index, prop] = key.split('__');

      acc[index] = acc[index] || {};
      acc[index][_.camelCase(prop)] = /^[{[]/.test(value) ? JSON.parse(value) : value;
      return acc;
    }, [])
    .reduce((acc, project) => {
      acc[project.name] = project;
      return acc;
    }, {});
}
