module.exports = {
    // Définir l'environnement de test (Node.js ici)
    testEnvironment: 'node',
  
    // Si tu utilises des extensions spécifiques ou si tu as des fichiers de test avec différentes extensions
    moduleFileExtensions: ['js', 'json', 'node'],
  
    // Spécifier où Jest doit chercher les tests
    testMatch: [
      '**/commands/**/*.test.js',    // Tests dans le dossier commands
      '**/events/**/*.test.js',      // Tests dans le dossier events
      '**/tasks/**/*.test.js',       // Tests dans le dossier tasks
      '**/utils/**/*.test.js',       // Tests dans le dossier utils
      '**/?(*.)+(spec|test).js',     // Autres fichiers de test (optionnel)
    ],
  
    // Transformation des fichiers avant les tests si nécessaire (par exemple avec Babel)
    transform: {
      '^.+\\.js$': 'babel-jest',  // Utilisation de babel-jest pour transformer les fichiers JS (si tu utilises Babel)
    },
  
    // Si tu veux collecter des informations sur la couverture de code
    collectCoverage: true,
  
    // Indiquer les fichiers pour lesquels Jest doit collecter la couverture de code
    collectCoverageFrom: [
      'commands/**/*.js',      // Inclure tous les fichiers JS dans le dossier commands
      'events/**/*.js',        // Inclure tous les fichiers JS dans le dossier events
      'tasks/**/*.js',         // Inclure tous les fichiers JS dans le dossier tasks
      'utils/**/*.js',         // Inclure tous les fichiers JS dans le dossier utils
      '!**/*.test.js',         // Ne pas inclure les fichiers de test dans la couverture
      '!config.js',            // Ignorer les fichiers de configuration
      '!index.js',             // Ignorer le fichier d'entrée principal
      '!**/node_modules/**',   // Ignorer node_modules
    ],
  
    // Ignorer certains fichiers ou répertoires pour les tests (comme les fichiers dans node_modules, build, etc.)
    testPathIgnorePatterns: ['/node_modules/', '/build/', '/.env/'],  // Ignorer les fichiers dans ces répertoires
  };
  