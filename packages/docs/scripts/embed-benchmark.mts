import 'ts-repo-utils';
import { workspaceRootPath } from './workspace-root-path.mjs';

const resultsPath = path.resolve(
  workspaceRootPath,
  '../synstate/samples/docs-site/benchmark/results.md',
);

const targetMarkdownFile = path.resolve(
  workspaceRootPath,
  'src/content/docs/guides/benchmark.md',
);

const startMarker = '<!-- benchmark-result -->';

const endMarker = '<!-- /benchmark-result -->';

const embedBenchmark = async (): Promise<void> => {
  const exists = await fs
    .access(resultsPath)
    .then(() => true)
    .catch(() => false);

  if (!exists) {
    console.log(
      '⚠ Benchmark results file not found. Run `pnpm --filter synstate run benchmark` first. Skipping.',
    );

    return;
  }

  const results = (await fs.readFile(resultsPath, 'utf8')).trim();

  const markdown = await fs.readFile(targetMarkdownFile, 'utf8');

  const startIndex = markdown.indexOf(startMarker);

  if (startIndex === -1) {
    throw new Error(`❌ ${startMarker} not found in ${targetMarkdownFile}`);
  }

  const endIndex = markdown.indexOf(endMarker, startIndex);

  if (endIndex === -1) {
    throw new Error(`❌ ${endMarker} not found in ${targetMarkdownFile}`);
  }

  const before = markdown.slice(
    0,
    Math.max(0, startIndex + startMarker.length),
  );

  const after = markdown.slice(Math.max(0, endIndex));

  const updated = `${before}\n${results}\n${after}`;

  await fs.writeFile(targetMarkdownFile, updated, 'utf8');

  console.log('✓ Embedded benchmark results into benchmark.md');
};

const result = await embedBenchmark().catch((error: unknown) => error);

if (result !== undefined) {
  console.error(result);

  process.exit(1);
}
