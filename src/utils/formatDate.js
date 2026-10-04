export const formatDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })