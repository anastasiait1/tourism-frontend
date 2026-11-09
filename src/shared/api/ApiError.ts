export type ValidationIssue = { loc?: Array<string | number>; msg?: string; type?: string };

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details: string[] = [],
    readonly payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let payload: unknown;
    try { payload = await response.json(); }
    catch { return new ApiError(response.statusText || "Ошибка сервера", response.status); }
    if (typeof payload === "object" && payload !== null && "detail" in payload) {
      const detail = (payload as { detail: unknown }).detail;
      if (typeof detail === "string") return new ApiError(detail, response.status, [], payload);
      if (Array.isArray(detail)) {
        const details = (detail as ValidationIssue[]).map((issue) => {
          const path = issue.loc?.filter((part) => part !== "body").join(".");
          return path ? `${path}: ${issue.msg ?? "Некорректное значение"}` : issue.msg ?? "Ошибка валидации";
        });
        return new ApiError(details[0] ?? "Ошибка валидации", response.status, details, payload);
      }
    }
    return new ApiError("Произошла ошибка при обращении к серверу", response.status, [], payload);
  }
}
