import { AreaModel } from "@/models/area.model";
import { AreasPaginationType } from "@/interfaces/areas.interfaces";

export const localAreasMapper = (area: AreasPaginationType) => {
  const { page, page_size, results, total, total_pages } = area;
  return new AreaModel({
    page: page,
    page_size: page_size,
    results: results,
    total: total,
    total_pages: total_pages,
  });
};
