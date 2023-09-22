export const rainingIntensity = (mm: number) : string => {
   let value;
   if (mm < 1) {
      value = 0;
   } else if (mm >= 1 && mm <= 10) {
      value = 1
   } else if (mm > 10 && mm < 50) {
      value = 2
   } else {
      value = 3
   }
   const text: { [key: number]: string } = {
      0: 'Looks like a sunny day for british people.',
      1: "Let's better get under her umbrella.",
      2: "Grab a snorkel and diving goggles just to be safe.",
      3: 'Consider building an ark.',
   }
   return text[value]
}