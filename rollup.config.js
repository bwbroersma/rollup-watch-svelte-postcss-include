import svelte from 'rollup-plugin-svelte';
import postcss from 'postcss';
import postcssImport from 'postcss-import';

export default {
  input: 'src/app.js',
  output: {
    file: 'build/client.js',
    format: 'iife',
  },
  watch: {
    include: 'src/**',
  },
  plugins: [
    svelte({
      cascade: true,
      preprocess: {
        style: ({ content, attributes }) => {
          if (attributes.type !== 'text/postcss') {
            return;
          }
          return new Promise((resolve, reject) => {
            postcss([postcssImport({
                path: ["src"],
              }),
            ]).process(content, {
                from: 'src',
                map: {
                  inline: false,
                },
            }).then(result => {
              resolve({
                code: result.css.toString(),
                map: result.map.toString(),
              });
            }).catch(err => reject(err));
          });
        },
      },
    })
  ]
};
