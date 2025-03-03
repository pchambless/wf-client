module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies are not allowed',
      from: {},
      to: {
        circular: true
      }
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'Modules should be used by someone',
      from: {
        orphan: true,
        pathNot: [
          '\\.(test|spec)\\.[jt]sx?$',
          '\\.stories\\.[jt]sx?$',
          '\\.d\\.ts$'
        ]
      },
      to: {}
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
      dependencyTypes: [
        'npm',
        'npm-dev',
        'npm-optional',
        'npm-peer',
        'npm-bundled'
      ]
    },
    includeOnly: '^src',
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: './tsconfig.json'
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+',
        theme: {
          graph: {
            rankdir: 'LR'
          }
        }
      },
      archi: {
        collapsePattern: '^src/[^/]+|^packages/[^/]+'
      }
    }
  }
};
