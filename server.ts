// server.ts
import 'zone.js/dist/zone-node';
import * as express from 'express';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';

const app = express();
const port = process.env['PORT'] || 4200;

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModule,
}));

app.set('view engine', 'html');
app.set('views', 'dist/browser');

app.get('*.*', express.static('dist/browser', {
  maxAge: '1y'
}));

app.get('*', (req, res) => {
  res.render('index', { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
});

app.listen(port, () => {
  console.log(`Node server listening on http://localhost:${port}`);
});
