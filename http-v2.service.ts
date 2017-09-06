import { ReplaySubject } from 'rxjs/ReplaySubject';

class Http {

  private options = {
    TIMEOUT: 10000
  };

  constructor( ) { }

  public get: GET = ( url: string, query: object = { }, headers: object = { }) => {

    const { xhr, subject } = this.init( );
    this.sendXHR( xhr, 'GET', url, query, { }, headers );

    return subject;

  }

  public post: POST = ( url: string, body: object = { }, headers: object = { }, query: object = { }) => {

    const { xhr, subject } = this.init( );
    this.sendXHR( xhr, 'POST', url, query, body, headers );

    return subject;
  }

  public delete: DELETE = ( url: string, query: object = { }, headers: object = { }) => {

    const { xhr, subject } = this.init( );
    this.sendXHR( xhr, 'DELETE', url, query, { }, headers );

    return subject;

  }

  public put: PUT = ( url: string, body: object = { }, headers: object = { }, query: object = { }) => {

    const { xhr, subject } = this.init( );
    this.sendXHR( xhr, 'PUT', url, query, body, headers );

    return subject;
  }

  // 代码提取
  private init = ( ): { xhr: XMLHttpRequest, subject: ReplaySubject< any > } => {

    const xhr = new XMLHttpRequest( );
    const subject = new ReplaySubject( 1 );

    this.decorateXHR( xhr, subject );
    return { xhr, subject };

  }

  //  发送xhr
  private sendXHR(
    xhr: XMLHttpRequest,
    type: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS',
    url: string,
    query: object = { },
    body: object = { },
    headers: object = { }): void {

      url += `?${this.toQueryString(query)}`;
      if ( process.env.NODE_ENV === 'development' ) {
        console.log(`http ${type}: ${url}`);
      }

      switch ( type ) {
        case 'DELETE': {
          xhr.open( 'DELETE', url, true );
          this.setHeaders( xhr, headers );
          xhr.send( );
          break;
        }

        case 'GET': {
          xhr.open( 'GET', url, true );
          this.setHeaders( xhr, headers );
          xhr.send( );
          break;
        }

        case 'POST': {
          xhr.open( 'POST', url, true );
          this.setHeaders( xhr, headers );
          xhr.send( JSON.stringify( body ));
          break;
        }

        case 'PUT': {
          xhr.open( 'PUT', url, true );
          this.setHeaders( xhr, headers );
          xhr.send( JSON.stringify( body ));
          break;
        }

        default: break;
      }
  }

  // xhr set headers
  private setHeaders( xhr: XMLHttpRequest, headers: object = { }): void {
    const keys = Object.keys( headers );
    if ( keys.length === 0 ) { return; }
    keys.map( k => xhr.setRequestHeader( k, headers[ k ]));
  }

  // 对象转查询字符串
  private toQueryString( query: object = { }): string {
    const keys = Object.keys( query );
    if ( keys.length === 0 ) { return ''; }
    return keys.map( k => `${k}=${query[k]}&`).join('');
  }

  // 监听xhr异步事件
  private decorateXHR( xhr: XMLHttpRequest, subject: ReplaySubject<any> ): void {

    // error 错误事件
    xhr.onerror = err => this.errorCloseConnection( xhr, subject, JSON.stringify( err ));

    // timeout事件
    xhr.timeout = this.options.TIMEOUT;
    xhr.ontimeout = err =>  this.errorCloseConnection( xhr, subject, JSON.stringify( err ));

    // readyStateChange事件
    xhr.onreadystatechange = ( ) => {

      const { readyState, status, statusText, responseText } = xhr;

      if ( readyState === 4 ) {

        // 成功
        if ( String(status).indexOf('2') === 0 || String(status).indexOf('3') ) {
          try {
            subject.next( JSON.parse( responseText ));
            subject.complete( );
          } catch ( e ) {
            this.errorCloseConnection( xhr, subject, JSON.stringify( e ));
          }
          // 失败
        } else {
            this.errorCloseConnection( xhr, subject, JSON.stringify({ statusText, status, responseText }));
        }
      }
    };

  }

  // 发生错误 - xhr关闭连接
  private errorCloseConnection( xhr: XMLHttpRequest, subject: ReplaySubject<any>, err: string ): void {
    xhr.abort( );
    subject.error( err );
    subject.complete( );
  }

  // 请求成功 - xhr关闭连接
  private successCloseConnection( xhr: XMLHttpRequest, subject: ReplaySubject<any>, err: string ): void {
    xhr.abort( );
    subject.complete( );
  }

}

interface GET {
    < R >( url: string ): ReplaySubject<R>
    < R, Q >( url: string, query: Q ): ReplaySubject<R>
    < R, Q, H >( url: string, query: Q, header: H ): ReplaySubject<R>
}

interface POST {
    < R >( url: string ): ReplaySubject< R >
    < R, B >( url: string, body: B ): ReplaySubject< R >
    < R, B, H >( url: string, body: B, header: H ): ReplaySubject< R >
    < R, B, H, Q >( url: string, body: B, header: H, query: Q ): ReplaySubject< R >
}

interface PUT {
    < R >( url: string ): ReplaySubject< R >
    < R, B >( url: string, body: B ): ReplaySubject< R >
    < R, B, H >( url: string, body: B, header: H ): ReplaySubject< R >
    < R, B, H, Q >( url: string, body: B, header: H, query: Q ): ReplaySubject< R >
}

interface DELETE {
    < R >( url: string ): ReplaySubject<R>
    < R, Q >( url: string, query: Q ): ReplaySubject<R>
    < R, Q, H >( url: string, query: Q, header: H ): ReplaySubject<R>
}

export default new Http( );