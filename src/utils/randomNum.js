export const generate_random_number = () => {
  const randomNum = Math.floor(Math.random() * 20) + 1;
  console.log('random number', randomNum);
  return randomNum;
};
