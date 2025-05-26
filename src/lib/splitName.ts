export const splitName = (fullname: string) => {
  if (!fullname) return { name: "", lastName: "", middleName: "", lastName2: "", lastName3: "" };
  const name = fullname.split(" ")[0];
  const middleName = fullname.split(" ")[1];
  const lastName = fullname.split(" ")[2];
  const lastName2 = fullname.split(" ")[3];
  const lastName3 = fullname.split(" ")[4];

  return { name, middleName, lastName, lastName2, lastName3 };
};
