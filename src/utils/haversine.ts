/**
 * Calcula a distancia (em km) entre duas coordenadas usando a formula de Haversine.
 * Usado no filtro geografico do raio sustentavel (US05).
 */
export function calcularDistanciaKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // raio da Terra em km
  const dLat = grausParaRadianos(lat2 - lat1);
  const dLon = grausParaRadianos(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(grausParaRadianos(lat1)) *
      Math.cos(grausParaRadianos(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function grausParaRadianos(graus: number): number {
  return (graus * Math.PI) / 180;
}
