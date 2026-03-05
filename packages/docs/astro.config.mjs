import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://noshiro-pf.github.io',
  base: '/synstate/',
  integrations: [
    starlight({
      title: 'SynState',
      favicon: '/favicon/favicon.ico',
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/synstate/favicon/favicon-32x32.png',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/synstate/favicon/favicon-16x16.png',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/synstate/favicon/apple-icon-180x180.png',
          },
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          autogenerate: { directory: 'getting-started' },
        },
        {
          label: 'Guides',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Examples',
          autogenerate: { directory: 'examples' },
        },
        {
          label: 'API Reference',
          items: [
            { slug: 'reference/api' },
            {
              label: 'State Management',
              items: [
                { slug: 'reference/create-state' },
                { slug: 'reference/create-reducer' },
                { slug: 'reference/create-boolean-state' },
              ],
            },
            {
              label: 'Event System',
              items: [
                { slug: 'reference/create-value-emitter' },
                { slug: 'reference/create-event-emitter' },
              ],
            },
            {
              label: 'Creation Functions',
              items: [
                { slug: 'reference/source' },
                { slug: 'reference/from-promise' },
                { slug: 'reference/from-subscribable' },
                { slug: 'reference/counter' },
                { slug: 'reference/timer' },
              ],
            },
            {
              label: 'Operators — Map',
              items: [
                { slug: 'reference/map' },
                { slug: 'reference/map-to' },
                { slug: 'reference/get-key' },
                { slug: 'reference/attach-index' },
                { slug: 'reference/map-optional' },
                { slug: 'reference/map-result-ok' },
                { slug: 'reference/map-result-err' },
                { slug: 'reference/unwrap-optional' },
                { slug: 'reference/unwrap-result-ok' },
                { slug: 'reference/unwrap-result-err' },
              ],
            },
            {
              label: 'Operators — Flat Map',
              items: [
                { slug: 'reference/merge-map' },
                { slug: 'reference/switch-map' },
              ],
            },
            {
              label: 'Operators — Filtering',
              items: [
                { slug: 'reference/filter' },
                { slug: 'reference/skip-if-no-change' },
                { slug: 'reference/skip' },
                { slug: 'reference/take' },
                { slug: 'reference/skip-while' },
                { slug: 'reference/take-while' },
                { slug: 'reference/skip-until' },
                { slug: 'reference/take-until' },
              ],
            },
            {
              label: 'Operators — Time',
              items: [
                { slug: 'reference/audit' },
                { slug: 'reference/debounce' },
                { slug: 'reference/throttle' },
              ],
            },
            {
              label: 'Operators — Others',
              items: [
                { slug: 'reference/pairwise' },
                { slug: 'reference/scan' },
                { slug: 'reference/with-buffered' },
                { slug: 'reference/with-current-value-from' },
                { slug: 'reference/with-initial-value' },
              ],
            },
            {
              label: 'Combination',
              items: [
                { slug: 'reference/combine' },
                { slug: 'reference/merge' },
                { slug: 'reference/zip' },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
