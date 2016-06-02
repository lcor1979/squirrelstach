import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNuts',
  pure: false
})
export class FilterNutsPipe implements PipeTransform {
	filterByText(nuts: any, filter: string): any {
		if (!filter) {
			return nuts;
		}
		else {
			var regexp: RegExp = new RegExp(filter, 'i');
			return nuts.filter(function(nut) {
				return regexp.test(nut.name);
			});
			//return array.filter(value => value.bind(regexp));
		}
	}

  transform(allNuts:any, searchValue?:string, category?:string):any {
	  var result;
	  if (!allNuts) {
		  result = [];
	  }
	  else if (!category) {
		  result = allNuts;
	  }
	  else {
		  result = allNuts.filter(nut => nut.category == category);
	  }

	  return this.filterByText(result, searchValue);
  }


}