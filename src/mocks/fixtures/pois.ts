import type { Poi } from "@domains/poi/model/poi.schemas";

export const mockPois: Poi[] = [
  { id: 1, name: "Мирский замок", description: "Архитектурный ансамбль XVI века и объект Всемирного наследия ЮНЕСКО.", category: "heritage", status: "approved", location: { type: "Point", coordinates: [26.4724, 53.4511] }, created_by: 1 },
  { id: 2, name: "Несвижский замок", description: "Историческая резиденция рода Радзивиллов.", category: "heritage", status: "approved", location: { type: "Point", coordinates: [26.6917, 53.2228] }, created_by: 1 },
  { id: 3, name: "Беловежская пуща", description: "Национальный парк с реликтовым лесом и богатой природой.", category: "eco_tourism", status: "approved", location: { type: "Point", coordinates: [23.9, 52.56] }, created_by: 1 },
  { id: 4, name: "Браславские озёра", description: "Живописный озёрный край на северо-западе Беларуси.", category: "eco_tourism", status: "approved", location: { type: "Point", coordinates: [27.03, 55.63] }, created_by: 1 },
  { id: 5, name: "Музей авиационной техники", description: "Открытая экспозиция авиационной техники в Боровой.", category: "unusual", status: "approved", location: { type: "Point", coordinates: [27.72, 53.98] }, created_by: 1 },
  { id: 6, name: "Троицкое предместье", description: "Исторический квартал в центре Минска.", category: "city", status: "approved", location: { type: "Point", coordinates: [27.556, 53.909] }, created_by: 1 },
  { id: 7, name: "Августовский канал", description: "Исторический водный путь среди природных ландшафтов.", category: "eco_tourism", status: "approved", location: { type: "Point", coordinates: [23.65, 53.88] }, created_by: 1 },
  { id: 8, name: "Коссовский дворец", description: "Неоготический дворец Пусловских.", category: "heritage", status: "approved", location: { type: "Point", coordinates: [25.15, 52.76] }, created_by: 1 },
];
