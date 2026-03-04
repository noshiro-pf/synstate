import 'ts-repo-utils';
import { extractSampleCode } from './embed-examples-utils.mjs';
import { workspaceRootPath } from './workspace-root-path.mjs';

const synstateSamplesRoot = path.resolve(
  workspaceRootPath,
  '../synstate/samples',
);

const codeBlockStart = '```tsx';

const codeBlockEnd = '```';

// --- Document → Sample mapping ---

const documents: DeepReadonly<
  {
    mdPath: string;
    samplesDir: string;
    sampleCodeFiles: string[];
  }[]
> = [
  {
    mdPath: path.resolve(
      workspaceRootPath,
      'src/content/docs/getting-started/introduction.md',
    ),
    samplesDir: path.resolve(synstateSamplesRoot, 'docs-site/introduction'),
    sampleCodeFiles: [
      '01-simple-state.mts',
      '02-simple-state-with-map.mts',
      '03-synstate-react-hooks-example.tsx',
    ],
  },
  {
    mdPath: path.resolve(
      workspaceRootPath,
      'src/content/docs/guides/react-integration.md',
    ),
    samplesDir: path.resolve(synstateSamplesRoot, 'readme'),
    sampleCodeFiles: [
      '02-synstate-react-hooks-example.tsx',
      '03-react-18-example.tsx',
      '04-react-example.tsx',
    ],
  },
  {
    mdPath: path.resolve(
      workspaceRootPath,
      'src/content/docs/examples/react.md',
    ),
    samplesDir: path.resolve(synstateSamplesRoot, 'readme'),
    sampleCodeFiles: [
      '06-global-counter.tsx',
      '07-todo-reducer.tsx',
      '08-dark-mode.tsx',
      '09-cross-component.tsx',
    ],
  },
  {
    mdPath: path.resolve(
      workspaceRootPath,
      'src/content/docs/examples/advanced.md',
    ),
    samplesDir: path.resolve(synstateSamplesRoot, 'readme'),
    sampleCodeFiles: [
      '10-search-debounce.tsx',
      '11-event-emitter-throttle.tsx',
      '05-simple-state-with-additional-api.mts',
    ],
  },
  {
    mdPath: path.resolve(
      workspaceRootPath,
      'src/content/docs/guides/how-synstate-solved-the-glitch.md',
    ),
    samplesDir: path.resolve(
      synstateSamplesRoot,
      'docs-site/how-synstate-solved-the-glitch',
    ),
    sampleCodeFiles: [
      '01-simple-glitch-example.synstate.mts',
      '01-simple-glitch-example.rxjs.mts',
      '01-simple-glitch-example.mobx.mts',
      '01-simple-glitch-example.jotai.mts',
      '01-simple-glitch-example.redux.mts',
      '01-simple-glitch-example.zustand.mts',
    ],
  },
] as const;

const embedExamples = async (): Promise<void> => {
  for (const { mdPath, sampleCodeFiles, samplesDir } of documents) {
    const markdownContent = await fs.readFile(mdPath, 'utf8');

    const mut_results: string[] = [];

    let mut_rest: string = markdownContent;

    for (const sampleCodeFile of sampleCodeFiles) {
      const samplePath = path.resolve(samplesDir, sampleCodeFile);

      const sampleContent = await fs.readFile(samplePath, 'utf8');

      const sampleContentSliced = extractSampleCode(sampleContent);

      const codeBlockStartIndex = mut_rest.indexOf(codeBlockStart);

      if (codeBlockStartIndex === -1) {
        throw new Error(
          `❌ codeBlockStart not found for ${sampleCodeFile} in ${mdPath}`,
        );
      }

      const codeBlockEndIndex = mut_rest.indexOf(
        codeBlockEnd,
        codeBlockStartIndex + codeBlockStart.length,
      );

      if (codeBlockEndIndex === -1) {
        throw new Error(
          `❌ codeBlockEnd not found for ${sampleCodeFile} in ${mdPath}`,
        );
      }

      const beforeBlock = mut_rest.slice(
        0,
        Math.max(0, codeBlockStartIndex + codeBlockStart.length),
      );

      const afterBlock = mut_rest.slice(Math.max(0, codeBlockEndIndex));

      mut_results.push(beforeBlock, sampleContentSliced);

      mut_rest = afterBlock;

      console.log(`✓ Updated code block for ${sampleCodeFile}`);
    }

    mut_results.push(mut_rest);

    await fs.writeFile(mdPath, mut_results.join('\n'), 'utf8');
  }
};

const result = await embedExamples().catch((error: unknown) => error);

if (result !== undefined) {
  console.error(result);

  process.exit(1);
}
