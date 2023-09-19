export const rainingIntensity = (mm: number) : string => {
   let value;
   if (mm < 10) {
      value = 0;
   } else if (mm > 10 && mm < 50) {
      value = 1
   } else {
      value = 2
   }
   const text : {[key: number]: string }= {
      0: "Time for some singing in the rain.",
      1: "Let's better get under her umbrella.",
      2: "Consider building an ark."
   }
   return text[value]
}