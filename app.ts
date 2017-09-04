import * as Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import * as KoaServer from "koa-static2";
import * as KoaRouter from 'koa-router';
import * as KoaLog from 'koa-logs-full';
import * as KoaBody from 'koa-bodyparser';

const app = new Koa( );
const router = new KoaRouter( );


router.get('/', async( ctx ) => {
  let indexPage = fs.readFileSync( path.join( __dirname, './index.html'), 'utf8' );
  ctx.body = indexPage;
})
router.get('/haha', async( ctx ) => {
  ctx.body = { name: '123123' }
})

app
  .use(KoaLog( app,{
      logdir: path.join( __dirname, 'logs')
  }))
  .use(KoaServer("static", __dirname + '/'))
  .use(KoaBody( ))
  .use(router.routes( ))
  .use(router.allowedMethods( ))
  .listen( 4000 )