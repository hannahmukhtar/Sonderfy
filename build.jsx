require('esbuild').build({
    entryPoints: ['/src/main.jsx'],
    bundle: true,
    loader: {
      '.js': 'jsx',
    },
    outfile: 'dist/bundle.js',
    watch: {
      onRebuild(error, result) {
        if (error) console.error('Watch build failed:', error)
        else console.log('Watch build succeeded:', result)
      }
    }
  }).catch(() => process.exit(1));
  
  