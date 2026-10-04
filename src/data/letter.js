export const LETTERS = [
    {
        id: 'principal',
        tone: 'pink', // pink | blue | butter
        label: 'Para ti',
        title: 'Una carta para ti',
        date: '2026-10-01', // fecha que sale en la carta (AAAA-MM-DD) o null
        unlockAt: null, // por ejemplo '2026-12-25' para que solo se abra desde ese día
        preview:
            'No sé cómo empezar... pero solo quiero que sepas que me haces muy feliz. Eres una de las mejores cosas que me han pasado y estoy muy agradecido de tenerte en mi vida.',
        greeting: 'Mi Lilian, mi papa',
        paragraphs: [
            'No sé cómo empezar... pero solo quiero que sepas que me haces muy feliz.',
            'Desde el 16 de marzo, cuando decidimos empezar esta historia juntos, mis días tienen más color. Eres una de las mejores cosas que me han pasado.',
            'Gracias por tus risas, por tus locuras y por estar siempre. Contigo hasta lo más simple se siente especial.',
            'Te prometo seguir sacándote sonrisas y llenar esta página, y nuestra vida, de recuerdos bonitos.',
        ],
        closing: 'Con todo mi corazón, siempre',
        signature: 'Tu camote',
        ps: 'P.D. Te quiero más de lo que cabe en esta carta.', // o null
    },
    {
        id: 'extranas',
        tone: 'pink', // pink | blue | butter
        label: 'abrelo cuando me extrañes',
        title: 'extranas ejemplo',
        date: '2026-10-01', // fecha que sale en la carta (AAAA-MM-DD) o null
        unlockAt: null, // por ejemplo '2026-12-25' para que solo se abra desde ese día
        preview:
            'No sé cómo empezar... pero solo quiero que sepas que me haces muy feliz. Eres una de las mejores cosas que me han pasado y estoy muy agradecido de tenerte en mi vida.',
        greeting: 'Mi Lilian, mi papa',
        paragraphs: [
            'No sé cómo empezar... pero solo quiero que sepas que me haces muy feliz.',
            'Desde el 16 de marzo, cuando decidimos empezar esta historia juntos, mis días tienen más color. Eres una de las mejores cosas que me han pasado.',
            'Gracias por tus risas, por tus locuras y por estar siempre. Contigo hasta lo más simple se siente especial.',
            'Te prometo seguir sacándote sonrisas y llenar esta página, y nuestra vida, de recuerdos bonitos.',
        ],
        closing: 'Con todo mi corazón, siempre',
        signature: 'Tu camote',
        ps: 'P.D. Te quiero más de lo que cabe en esta carta.', // o null
    },

    // Para agregar más cartas ("Ábrela cuando..."), copia el bloque de arriba,
    // cambia el id, el tone, el label y los textos. Con 2 o más cartas aparece el selector.
    // {
    //   id: 'extranas',
    //   tone: 'blue',
    //   label: 'Cuando me extrañes',
    //   title: 'Ábrela cuando me extrañes',
    //   date: null,
    //   unlockAt: null,
    //   preview: '...',
    //   greeting: '...',
    //   paragraphs: ['...'],
    //   closing: '...',
    //   signature: 'Tu camote',
    //   ps: null,
    // },
]

// Compatibilidad con la tarjeta del Inicio
export const LETTER = LETTERS[0]