import http from './http-v2.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';

http
  .get< any, {sex:string},{accToken:string}>('/haha',{ sex: 'asdsd'},{accToken:'sdasd'})
  .do(x => console.log('------GET-------'))
  .do(console.log)
  .subscribe( )

http
  .post< any, { name: string },{accToken:string},{id:number}>('/haha', { name: 'asdasd'},{accToken:'sdasd'},{id:123})
  .do(x => console.log('------POST-------'))
  .do(console.log)
  .subscribe( )

http
  .delete< any, { name: string },{accToken:string}>('/haha', { name: 'asdasd'},{accToken:'sdasd'})
  .do(x => console.log('------DELETE-------'))
  .do(console.log)
  .subscribe( )

http
  .put< any, { name: string },{accToken:string},{id:number}>('/haha', { name: 'asdasd'},{accToken:'sdasd'},{id:123})
  .do(x => console.log('------PUT-------'))
  .do(console.log)
  .subscribe( )