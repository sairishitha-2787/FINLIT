export const preloadCharacterImages = () => {
  const images = [
    '/CHARACTERS/GAMING_A-Raeveth_Character.png',
    '/CHARACTERS/GAMING_CHIBI_VER-_A-Raeveth.png',
    '/CHARACTERS/GAMING_F-Thessiveil_Character.png',
    '/CHARACTERS/GAMING_CHIBI_VER-_F-_Thessiveil.png',
    '/CHARACTERS/GAMING_M-Caeldryn_Character.png',
    '/CHARACTERS/GAMING_CHIBI_VER-M-_Caeldryn.png',
  ];
  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};
