import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform<T>(items: T[] | null, searchText: string, fields?: (keyof T)[]): T[] {
    if (!items) return [];
    if (!searchText) return items;

    const search = searchText.toLowerCase();

    return items.filter((item) => {
      // If fields specified → search inside them only
      if (fields?.length) {
        return fields.some((field) => item[field]?.toString().toLowerCase().includes(search));
      }

      // Global search → search inside all object properties
      return Object.values(item as any).some((value) =>
        value?.toString().toLowerCase().includes(search),
      );
    });
  }
}
