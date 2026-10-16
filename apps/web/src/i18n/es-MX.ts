/**
 * Every interface text of the web app, in Spanish (Mexico) (B5).
 *
 * Components read texts from here instead of writing them inline, so a missing
 * or misspelled key is a compile error and wording changes happen in one place.
 * No agency text lives here: names, slogans and the like come from the database.
 */
export const t = {
  platform: {
    name: 'Focal Drop',
  },
  home: {
    description: 'Sitios y galerías privadas para agencias de fotografía.',
  },
  admin: {
    nav: {
      label: 'Navegación del panel',
      home: 'Inicio',
    },
    home: {
      title: 'Inicio',
      placeholder: 'Aquí verás el resumen de tu agencia y de tus galerías.',
    },
  },
} as const;
