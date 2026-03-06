import 'ts-repo-utils';
import { workspaceRootPath } from './workspace-root-path.mjs';

const benchmarkSamplesDir = path.resolve(
  workspaceRootPath,
  '../synstate/samples/docs-site/benchmark',
);

const targetMarkdownFile = path.resolve(
  workspaceRootPath,
  'src/content/docs/guides/benchmark.md',
);

type EmbedTarget = Readonly<{
  resultsFile: string;
  startMarker: string;
  endMarker: string;
}>;

const targets: readonly EmbedTarget[] = [
  {
    resultsFile: 'results.md',
    startMarker: '<!-- benchmark-result -->',
    endMarker: '<!-- /benchmark-result -->',
  },
  {
    resultsFile: 'results-diamond.md',
    startMarker: '<!-- benchmark-result-diamond -->',
    endMarker: '<!-- /benchmark-result-diamond -->',
  },
] as const;

const embedBenchmark = async (): Promise<void> => {
  let mut_markdown = await fs.readFile(targetMarkdownFile, 'utf8');

  for (const { resultsFile, startMarker, endMarker } of targets) {
    const resultsPath = path.resolve(benchmarkSamplesDir, resultsFile);

    const exists = await fs
      .access(resultsPath)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      console.log(
        `⚠ ${resultsFile} not found. Run \`pnpm --filter synstate run benchmark\` first. Skipping.`,
      );

      continue;
    }

    const results = await fs.readFile(resultsPath, 'utf8');

    const startIndex = mut_markdown.indexOf(startMarker);

    if (startIndex === -1) {
      throw new Error(`❌ ${startMarker} not found in ${targetMarkdownFile}`);
    }

    const endIndex = mut_markdown.indexOf(endMarker, startIndex);

    if (endIndex === -1) {
      throw new Error(`❌ ${endMarker} not found in ${targetMarkdownFile}`);
    }

    const before = mut_markdown.slice(
      0,
      Math.max(0, startIndex + startMarker.length),
    );

    const after = mut_markdown.slice(Math.max(0, endIndex));

    mut_markdown = `${before}\n${results.trim()}\n${after}`;

    console.log(`✓ Embedded ${resultsFile} into benchmark.md`);
  }

  await fs.writeFile(targetMarkdownFile, mut_markdown, 'utf8');
};

const result = await embedBenchmark().catch((error: unknown) => error);

if (result !== undefined) {
  console.error(result);

  process.exit(1);
}
