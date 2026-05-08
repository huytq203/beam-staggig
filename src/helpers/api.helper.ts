export class ApiHelper {
  static getListUri = <T>(
    domain: string,
    uriEnums: T,
  ): {
    [key in keyof typeof uriEnums]: key
  } => {
    const listUri: any = uriEnums as any
    return Object.keys(listUri).reduce(
      (obj: any, item: any) =>
        Object.assign(obj, { [item]: domain + listUri[item] }),
      {},
    )
  }
}
