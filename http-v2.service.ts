import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';


class Http {

  private options = {
    TIMEOUT: 10000
  }

  constructor( ) {
    
  }

  public get: GET = ( url: string, query: Object = { }, headers: Object = { }) => {
    
    const xhr = new XMLHttpRequest( );
    const subject = new BehaviorSubject( null );

    this.decorateXHR( xhr, subject );

    this.sendXHR( xhr, 'GET', url, query, { }, headers );

    return subject;

  }

  //  发送xhr
  private sendXHR( 
    xhr: XMLHttpRequest, 
    type: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS',
    url: string,
    query?: Object,
    body?: Object,
    headers?: Object ): void {

      // 设置头部信息
      this.setHeaders( xhr, headers );

      switch( type ) {

        case "GET": {
          url += `?${this.toQueryString(query)}`;
          xhr.open( 'GET', url, true );
          xhr.send( );
          break;
        }

        default: break;
      }
  }

  // xhr set headers 
  private setHeaders( xhr: XMLHttpRequest, headers: Object ={ }): void {
    const keys = Object.keys( headers );
    if ( keys.length === 0 ) { return ;}
    keys.map(( k ) => xhr.setRequestHeader( k, headers[ k ]));
  }

  // 对象转查询字符串
  private toQueryString( query: Object = { }): string {
    const keys = Object.keys( query );
    if ( keys.length === 0 ) { return '' }
    return keys.map( k => `${k}=${query[k]}&`).join('');
  }

  // 监听xhr异步事件
  private decorateXHR( xhr: XMLHttpRequest, subject: BehaviorSubject<any> ): void {

    // error 错误事件
    xhr.onerror = err => this.errorCloseConnection( xhr, subject, JSON.stringify( err ));

    // timeout事件
    xhr.timeout = this.options.TIMEOUT;
    xhr.ontimeout = err =>  this.errorCloseConnection( xhr, subject, JSON.stringify( err ));

    // readyStateChange事件
    xhr.onreadystatechange = ( ) => {
      
      let { readyState, status, statusText } = xhr;

      if ( readyState === 4 ) {

        // 成功
        if ( String(status).indexOf('2') === 0 || String(status).indexOf('3') ) {
          try {
            subject.next( xhr.responseText );
            subject.complete( );
          } catch ( e ) {
            this.errorCloseConnection( xhr, subject, JSON.stringify( e ));
          }
          // 失败
        } else {
            this.errorCloseConnection( xhr, subject, statusText );
        }
      }
    }



  }

  // 发生错误 - xhr关闭连接
  private errorCloseConnection( xhr: XMLHttpRequest, subject: BehaviorSubject<any>, err: string ): void {
    xhr.abort( );
    subject.error( err )
    subject.complete( );
  }

  // 请求成功 - xhr关闭连接
  private successCloseConnection( xhr: XMLHttpRequest, subject: BehaviorSubject<any>, err: string ): void {
    xhr.abort( );
    subject.complete( );
  }


}

interface GET {
    < R >( url: string ): BehaviorSubject<R>
    < R, Q >( url: string, query: Q ): BehaviorSubject<R>
    < R, Q, H >( url: string, query: Q, header: H ): BehaviorSubject<R>
}

const http = new Http( );

var a = http.get('/haha');


a
  .do(console.log)
  .subscribe( )










