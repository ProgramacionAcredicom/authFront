import apiServices from "../configAxios";

export const listAreas = async () => {
  const res = await apiServices.get("/areas/sin-paginacion/");
  return res.data;
};
