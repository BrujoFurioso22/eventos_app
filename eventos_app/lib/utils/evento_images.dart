class EventoImages {
  static const Map<String, String> _imageMap = {
    '#CeciFest2026 por Ceci Juno': 'cecifest.png',
    'NO TE VA GUSTAR "FLORECE EN EL CAOS TOUR" - CUENCA':
        'notevaagustar-cuenca.png',
    'NO TE VA GUSTAR "FLORECE EN EL CAOS TOUR" - QUITO':
        'notevaagustar-quito.png',
    'Campanazo Navideño: Pan de Dulce & Emir Tansel':
        'campanazonavideno-guayaquil.png',
    'PAPAYAL - Fin de Año 2025': 'papayal-guayaquil.png',
    'THE LAST FLAME: NEW YEAR\'S EVE': 'thelastflame-cuenca.png',
    'ORIGEN CASA BLANCA': 'origencasablanca.png',
    'MOËT & CHANDON X MILAGRO PRESENTAN: DESDE CERO': 'desdecero-cuenca.png',
    'REVENTÓN 2026': 'reventon-santaelena.png',
    'New Year x Imsoniac & Mon Nu': 'newyearximsoniac-quito.png',
    '366 FEST - Galapagos Sound Waves': '366fest-puertoayora.png',
    'NEW YEAR\'S EVE 2026': 'newyearseve-cuenca.png',
    'La Viuda 2025': 'laviuda-loja.png',
    'LA FIESTA DEL FIN DEL MUNDO': 'fiestadelfindelmundo-cuenca.png',
  };

  static String? getImagePath(String titulo) {
    final imageName = _imageMap[titulo];
    if (imageName != null) {
      return 'assets/events/$imageName';
    }
    return null;
  }

  static bool hasImage(String titulo) {
    return _imageMap.containsKey(titulo);
  }
}
